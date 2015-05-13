#include <node.h>
#include <stdio.h>
#include "json/json.h"
#include "jobSchedule.h"
using namespace v8;

bool parseInput(const char * cstr, vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths)
{
	drivers.clear(); tasks.clear(); paths.clear(); 
	Json::Reader reader;
	Json::Value root;
	std::string str(cstr);
	if (!reader.parse(str, root, false)) {
		//cout<< "parse failed:" << reader.getFormattedErrorMessages() << endl;
		printf("parse failed."); 
		return false;
	}
	Json::Value driversA = root["drivers"];
	Json::Value tasksA = root["tasks"];
	Json::Value pathsA = root["paths"];
	for (unsigned int i=0; i<driversA.size(); i++) {
		CID driverID = driversA[i]["ID"].asCString();
		CTime avlbTime = driversA[i]["avlbTime"].asDouble();
		CTime offWorkTime = driversA[i]["offTime"].asDouble();
		CLocationID avlbLoc = driversA[i]["venue"].asCString();
		drivers.push_back(CDriver(driverID, avlbTime, offWorkTime, avlbLoc));
	}
	for (unsigned int i=0; i<tasksA.size(); i++) {
		CID id = tasksA[i]["ID"].asCString();
		CLocationID venue = tasksA[i]["venue"].asCString();
		CTime deadline = tasksA[i]["deadline"].asDouble(); 
		CTime readyTime = 0;  
		CID asgnDriverID = tasksA[i]["asgnDriver"].asCString(); 
		CID prevTaskID = tasksA[i]["prevTaskID"].asCString(); 
		tasks.push_back(CTask(id,venue,deadline,readyTime,asgnDriverID,prevTaskID));
	}
	for (unsigned int i=0; i<pathsA.size(); i++) {
		CLocationID src = pathsA[i]["src"].asCString();
		CLocationID dst = pathsA[i]["dst"].asCString();
		CRTime distance = pathsA[i]["distance"].asDouble();
		paths.push_back(CPath(src, dst, distance));
	}
	//printf("read %d drivers, %d tasks, %d paths:\n", drivers.size(), tasks.size(), paths.size());
	//for (unsigned int i=0; i<drivers.size(); i++) {
	//	printf("driver %d:  ID=%s, offTime = %d\n", i, drivers[i]["ID"].asString().c_str(), drivers[i]["offTime"].asInt());
	//}
	return true;
}

std::string prepareOutput(vector<CScheduleItem> &schedule) 
{
	Json::Value root;
	Json::Value schd;
	Json::Value schdItem;
	for (unsigned int i=0; i<schedule.size(); i++) if (schedule[i].asgnTaskID.size() > 0) {
		schdItem["driver"] = schedule[i].driverID;
		Json::Value taskList;
		for (unsigned int j=0; j<schedule[i].asgnTaskID.size(); j++) {
			Json::Value task;
			task["taskID"] = schedule[i].asgnTaskID[j];
			taskList.append(task);
		}
		schdItem["taskList"] = taskList;
		schd.append(schdItem);
	}
	root["schedules"] = schd;

	Json::FastWriter writer;
	return writer.write(root);
}

void Method(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);
	const char * cstr;
	String::Utf8Value str(args[0]->ToString());
	cstr = *str;

	bool ret = false;
	vector<CDriver> drivers;
	vector<CTask> tasks;
	vector<CPath> paths;
	vector<CScheduleItem> schedule;
	schedule.clear();
	if (parseInput(cstr, drivers, tasks, paths))
		ret = ALG::findScheduleGreedy(drivers, tasks, paths, schedule);
	printf("search exit with code %d.\n", ret);
	args.GetReturnValue().Set(String::NewFromUtf8(isolate, prepareOutput(schedule).c_str()));
}

void init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "search", Method);
}

NODE_MODULE(jobSchedule, init)
