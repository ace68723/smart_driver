#include <node.h>
#include <stdio.h>
#include "json/json.h"
#include "jobSchedule.h"
using namespace v8;

bool parseInput(const char * cstr, CTime & curTime, vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths)
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
	curTime = root["curTime"].asInt();
	Json::Value driversA = root["drivers"];
	Json::Value tasksA = root["tasks"];
	Json::Value pathsA = root["paths"];
	for (unsigned int i=0; i<driversA.size(); i++) {
		CID driverID = driversA[i]["did"].asCString();
		CTime avlbTime = driversA[i]["available"].asDouble();
		CTime offWorkTime = driversA[i]["off"].asDouble();
		CLocationID avlbLoc = driversA[i]["location"].asCString();
		drivers.push_back(CDriver(driverID, avlbTime, offWorkTime, avlbLoc));
	}
	for (unsigned int i=0; i<tasksA.size(); i++) {
		CID id = tasksA[i]["tid"].asCString();
		CLocationID venue = tasksA[i]["location"].asCString();
		CTime deadline = tasksA[i]["deadline"].asDouble(); 
		CTime readyTime = 0;  
		CID asgnDriverID = tasksA[i]["did"].asCString(); 
		CID prevTaskID = tasksA[i]["depend"].asCString(); 
		tasks.push_back(CTask(id,venue,deadline,readyTime,asgnDriverID,prevTaskID));
	}
	for (unsigned int i=0; i<pathsA.size(); i++) {
		CLocationID src = pathsA[i]["start"].asCString();
		CLocationID dst = pathsA[i]["end"].asCString();
		CRTime distance = pathsA[i]["time"].asDouble();
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
	for (unsigned int i=0; i<schedule.size(); i++) //if (schedule[i].asgnTaskID.size() > 0) {
	{
		schdItem["did"] = schedule[i].did;
		Json::Value taskList;
		for (unsigned int j=0; j<schedule[i].tids.size(); j++) {
			//Json::Value task;
			//task["taskID"] = schedule[i].asgnTaskID[j];
			//taskList.append(task);
			taskList.append(schedule[i].tids[j]);
		}
		schdItem["tids"] = taskList;
		schdItem["available"] = schedule[i].available;
		schdItem["off"] = schedule[i].off;
		schdItem["location"] = schedule[i].location;
		schdItem["updated"] = schedule[i].updated;
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
	CTime curTime;
	vector<CDriver> drivers;
	vector<CTask> tasks;
	vector<CPath> paths;
	vector<CScheduleItem> schedule;
	schedule.clear();
	if (parseInput(cstr, curTime, drivers, tasks, paths))
		ret = ALG::findScheduleGreedy(curTime, drivers, tasks, paths, schedule);
	//printf("search algorithm returned %d (1 for normal).\n", ret);
	Local<String> schd_string = String::NewFromUtf8(isolate, prepareOutput(schedule).c_str());
	//args.GetReturnValue().Set(schd_string);
	Local<Function> cb = Local<Function>::Cast(args[1]);
	const unsigned int argc = 1;
	Local<Value> argv[argc] = {schd_string};
	cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
}

void init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "search", Method);
}

NODE_MODULE(jobSchedule, init)
