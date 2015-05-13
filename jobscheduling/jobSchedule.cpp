//#include <stdio.h>
#include "jobSchedule.h"

double ALG::map[MAXNLOCATIONS][MAXNLOCATIONS];

void ALG::calDFTime(int iStart, int iEnd, CDriver & driver, vector<CTask> & tasks, int curLoc, CTime & dTime, CTime & fTime)
{
	for (int i=iStart; i<iEnd; i++) {
		int iNext = driver.tasksAtHand[i];
		fTime += map[curLoc][tasks[iNext].iVenue];
		curLoc = tasks[iNext].iVenue;
		if (fTime > tasks[iNext].deadline) 
			dTime += fTime - tasks[iNext].deadline;
	}
}
double ALG::tryAddTask(int iTask, int iDriver, CDriver & driver, vector<CTask> & tasks)
	//return the evaluation, the higher the better
{
	CTime fTime= driver.avlbTime;
	CTime dTime=0;
	//calculate the new finish time and delay time
	int curLoc = driver.iLocation;
	fTime += map[curLoc][tasks[iTask].iVenue];
	curLoc = tasks[iTask].iVenue;
	if (fTime > tasks[iTask].deadline) dTime += fTime - tasks[iTask].deadline;
	if (tasks[iTask].iNextTask == -1) {
		calDFTime(0, driver.tasksAtHand.size(), driver, tasks, curLoc, dTime, fTime); 
	}
	else {
		int introTask = tasks[iTask].iNextTask;
		CTime bestDTime=0, bestFTime;
		bestFTime = fTime + map[curLoc][tasks[introTask].iVenue];
		if (bestFTime > tasks[introTask].deadline) 
			bestDTime += bestFTime - tasks[introTask].deadline;
		calDFTime(0, driver.tasksAtHand.size(), driver, tasks, tasks[introTask].iVenue, bestDTime, bestFTime);
		for (unsigned int i=0; i<driver.tasksAtHand.size(); i++) {
			CTime tempd, tempf;
			tempf = fTime; tempd = dTime;
			calDFTime(0, i+1, driver, tasks, curLoc, tempd, tempf);
			int iLoc = tasks[driver.tasksAtHand[i]].iVenue;
			tempf += map[iLoc][tasks[introTask].iVenue];
			if (tempf > tasks[introTask].deadline) 
				tempd += tempf - tasks[introTask].deadline;
			iLoc = tasks[introTask].iVenue;
			calDFTime(i+1, driver.tasksAtHand.size(), driver, tasks, iLoc, tempd, tempf);
			if (tempf > driver.offTime) continue;
			if (driver.delayTime <=0 && tempd > 0) continue;
			if (bestFTime > driver.offTime || bestDTime > tempd) {
				bestFTime = tempf;
				bestDTime = tempd;
			}
		}
		fTime = bestFTime;
		dTime = bestDTime;
	}


	//printf("try assign task %d to dirver %d.\n", iTask, iDriver);
	if (fTime > driver.offTime) {
		//printf("infeasible because of offwork time\n");
		return 0;
	}
	if (driver.delayTime <= 0 && dTime > 0) {
		//printf("infeasible because this would cause jobs at hand delayed\n");
		return 0;
	}
	double delta = dTime - driver.delayTime;
	if (delta == 0) delta = 0.01;
	return 100/delta;
}
void ALG::arrange_future_tasks(CDriver & driver, vector<CTask> & tasks)
{
	driver.finishTime = 0;
	driver.delayTime = 0;
	CTime curTime = driver.avlbTime;
	vector<bool> mark(driver.tasksAtHand.size(), false);
	int curLoc = driver.iLocation;
	for (unsigned int i=0; i<driver.tasksAtHand.size(); i++) {
		int nextj = -1;
		CTime bestTime = -1;
		for (unsigned int j=0; j<driver.tasksAtHand.size(); j++) if (!mark[j]) {
			int iTask = driver.tasksAtHand[j];
			if (tasks[iTask].iPrevTask != -1 && tasks[tasks[iTask].iPrevTask].iDriver == -1) {
				//assert tasks[tasks[iTask].iPrevTask].iAsgnDriver == this Driver)
				bool bFeasible = true;
				int iPrevTask = tasks[iTask].iPrevTask;
				for (unsigned int k=0; k<driver.tasksAtHand.size(); k++)
					if (iPrevTask == driver.tasksAtHand[k]) {
						bFeasible = mark[k];
						break;
					}
				if (!bFeasible) continue;
			}
			if (bestTime == -1 || bestTime > map[curLoc][tasks[iTask].iVenue]) {
				bestTime = map[curLoc][tasks[iTask].iVenue];
				nextj = j;
			}
		}
		//now go to nextTask
		mark.at(nextj) = true;
		int iTask = driver.tasksAtHand[nextj];
		curTime += map[curLoc][tasks[iTask].iVenue];
		curLoc = tasks[iTask].iVenue;
		if (tasks[iTask].deadline < curTime)
			driver.delayTime += curTime - tasks[iTask].deadline;
	}
	driver.finishTime = curTime;
	return;
}
bool ALG::select_next_task(CDriver & driver, int iDriver, vector<CTask> & tasks, int & iSelectedTask)
	// return if a new job is selected
{
	iSelectedTask = -1;
	double bestEva = 0;
	for (unsigned int j=0; j<tasks.size(); j++) if (tasks[j].iDriver == -1) { //for each unsigned tasks
		if (tasks[j].iPrevTask>=0 && tasks[tasks[j].iPrevTask].iDriver == -1)
			continue;
		if (tasks[j].iAsgnDriver>=0) { 
			/*
			if (tasks[j].iAsgnDriver != iDriver) 
				continue; //this task cannot be assigned to this driver	
			int iEnd = driver.tasksAtHand.size() -1;
			if (driver.tasksAtHand.at(iEnd) != j) 
				continue; //since the future jobs have been arranged, we only consider the next job
				*/
			continue; //only consider the job that can be assigned to this driver in this loop
		}
		double evaluation = tryAddTask(j, iDriver, driver, tasks);
		if (evaluation > bestEva) {
			bestEva = evaluation;
			iSelectedTask = j;
		}
	}
	if (iSelectedTask == -1 && driver.tasksAtHand.size()>0) {
		iSelectedTask = driver.tasksAtHand[driver.tasksAtHand.size()-1];
	}
	return (iSelectedTask != -1);
}
//assume each task has only one prevTask or nextTask
bool ALG::findScheduleGreedy(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule)
{
	int nLocations;
	if (!preProcess(drivers, tasks, paths, nLocations)) 
		return false;
	vector<int> prior(drivers.size());
	for (unsigned int i=0; i<drivers.size(); i++) prior[i] = i;
	for (unsigned int i=0; i<drivers.size(); i++) {
		for (unsigned int j=i+1; j<drivers.size(); j++)
			if (drivers[prior[i]].tasksAtHand.size() < drivers[prior[j]].tasksAtHand.size()) 
				std::swap(prior[i],prior[j]);
	}
	//use the driver with non-empty tasksAtHand first
	for (unsigned int ti=0; ti<drivers.size(); ti++) 
	{
		int i = prior[ti];
		//try to assign as much job to the driver as possible
		while (1)
		{
			int j;
			if (!select_next_task(drivers[i], i, tasks, j)) break;
			assignTaskToDriver(j, i, drivers, tasks);
		}
	}
	//set up schedule according to each driver's taskList
	schedule.clear();
	for (unsigned int i=0; i<drivers.size(); i++) if (drivers[i].taskList.size()){
		CScheduleItem si;
		si.driverID = drivers[i].id;
		si.asgnTaskID.clear();
		for (unsigned int j=0; j<drivers[i].taskList.size(); j++) {
			int idx = drivers[i].taskList[j];
			si.asgnTaskID.push_back(tasks[idx].id);
		}
		schedule.push_back(si);
	}

	return true;
}
void ALG::assignTaskToDriver(int iTask, int iDriver, vector<CDriver> & drivers, vector<CTask> & tasks)
{
	//printf("assign task %d to driver %d\n", iTask, iDriver);
	drivers[iDriver].taskList.push_back(iTask);
	tasks[iTask].iDriver = iDriver;
	drivers[iDriver].avlbTime += map[drivers[iDriver].iLocation][tasks[iTask].iVenue];
	drivers[iDriver].iLocation = tasks[iTask].iVenue;
	if (tasks[iTask].iAsgnDriver == iDriver) {
		//assert the last taskAtHand is chosen 
		int j=drivers[iDriver].tasksAtHand.size() - 1;
		if (drivers[iDriver].tasksAtHand[j] != iTask) {
			//printf("internal error while assigning task to driver!\n");
			return;
		}
		drivers[iDriver].tasksAtHand.pop_back();
		//assert j==drivers[iDriver].tasksAtHand.size() //note we have erase the element
	}
	if (tasks[iTask].iNextTask >= 0) {
		int j = tasks[iTask].iNextTask;
		tasks[j].iAsgnDriver = iDriver;
		drivers[iDriver].tasksAtHand.push_back(j);
		arrange_future_tasks(drivers[iDriver], tasks);
	}
}
bool ALG::preProcess(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, int &nLocations)
{
	vector<CLocationID> locationIDs;
	for (unsigned int i=0; i<paths.size(); i++) {
		int findID = -1;
		for (unsigned int j=0; j<locationIDs.size(); j++)
			if (locationIDs[j] == paths[i].source){
				findID = j;
				break;
			}
		if (findID < 0) {
			locationIDs.push_back(paths[i].source);
			findID = locationIDs.size() -1;
		}
		paths[i].iSrc = findID;
		findID = -1;
		for (unsigned int j=0; j<locationIDs.size(); j++)
			if (locationIDs[j] == paths[i].dest){
				findID = j;
				break;
			}
		if (findID < 0) {
			locationIDs.push_back(paths[i].dest);
			findID = locationIDs.size() -1;
		}
		paths[i].iDst = findID;
	}
	nLocations = locationIDs.size();
	if (nLocations > MAXNLOCATIONS)
		return false; // too many locations
	for (int i=0; i<nLocations; i++)
		for (int j=0; j<nLocations; j++)
			map[i][j] = (i==j)? 0: -1;
	for (unsigned int i=0; i<paths.size(); i++) 
		map[paths[i].iSrc][paths[i].iDst] = paths[i].dist;
	/* find the shortest paths, this should NOT be necessary */
	for (int k=0; k<nLocations; k++)
		for (int i=0; i<nLocations; i++) {
			if (i==k) continue;
			for (int j=0; j<nLocations; j++) {
				if (j==i || j==k) continue;
				if (map[i][k]>=0 && map[k][j]>=0 && (map[i][j] < 0 || map[i][j] > map[i][k]+map[k][j]))
					map[i][j] = map[i][k] + map[k][j];
			}
		}
	for (unsigned int i=0; i<drivers.size(); i++) {
		drivers[i].tasksAtHand.clear();
		drivers[i].taskList.clear();
		drivers[i].iLocation = -1;
		for (int j=0; j<nLocations; j++) 
			if (drivers[i].avlbLocation == locationIDs[j]) {
				drivers[i].iLocation = j;
				break;
			}
		if (drivers[i].iLocation == -1) return false;
	}
	// convert tasks.asgnDriverID/prevTaskID to integer id -- the corresponding index
	// set drivers[].tasksAtHand tasks[].iNextTask
	for (unsigned int i=0; i<tasks.size(); i++) tasks[i].iNextTask = -1;
	for (unsigned int i=0; i<tasks.size(); i++) {
		tasks[i].iDriver = -1;
		tasks[i].iAsgnDriver = -1;
		if (tasks[i].asgnDriverID != NULL_ID) {
			for (unsigned int j=0; j<drivers.size(); j++)
				if (drivers[j].id == tasks[i].asgnDriverID) {
					drivers[j].tasksAtHand.push_back(i);
					tasks[i].iAsgnDriver = j;
					break;
				} 
			//assert(tasks[i].iAsgnDriver != -1); //or return false;
			if (tasks[i].iAsgnDriver == -1) return false;
		}
		tasks[i].iPrevTask = -1;
		if (tasks[i].prevTaskID != NULL_ID) {
			for (unsigned int j=0; j<tasks.size(); j++) 
				if (tasks[j].id == tasks[i].prevTaskID) {
					tasks[i].iPrevTask = j;
					tasks[j].iNextTask = i;
					break;
				}
			//assert(tasks[i].iPrevTask != -1); //or return false;
			if (tasks[i].iPrevTask == -1) return false;
		}
		tasks[i].iVenue = -1;
		for (int j=0; j<nLocations; j++) 
			if (tasks[i].venue == locationIDs[j]) {
				tasks[i].iVenue = j;
				break;
			}
			//assert(tasks[i].iVenue != -1); //or return false;
			if (tasks[i].iVenue == -1) return false;
	}
	for (unsigned int i=0; i<drivers.size(); i++) 
		arrange_future_tasks(drivers[i], tasks); //after the arrangement, the tasks are in reverse order

	return true;
}
bool ALG::findScheduleBasic(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule)
{
	int nLocations;
	if (!preProcess(drivers, tasks, paths, nLocations)) 
		return false;
	int nDrivers = drivers.size();
	int lastDriver = -1;
	for (unsigned int j=0; j<tasks.size(); j++) 
		if (tasks[j].iDriver == -1 && tasks[j].iPrevTask == -1){ 
			//assign fetch job/deliver job with a finished fetch job
			int k = tasks[j].iAsgnDriver;
			if (k == -1) 
				lastDriver = k = (lastDriver+1)%nDrivers;
			assignTaskToDriver(j, k, drivers, tasks);
		}
	for (unsigned int j=0; j<tasks.size(); j++) 
		if (tasks[j].iDriver == -1 && tasks[j].iPrevTask >= 0){ //assign deliver job 
		//there is an abnormal case that a deliver job is restricted to some driver 
		//but its previous fetch job is not fixed.
			int j1 = tasks[j].iPrevTask;
			//assert(tasks[j1].iDriver != -1) 
			assignTaskToDriver(j, tasks[j1].iDriver, drivers, tasks);
		}
	//set up schedule according to each driver's taskList
	schedule.clear();
	for (unsigned int i=0; i<drivers.size(); i++) if (drivers[i].taskList.size()){
		CScheduleItem si;
		si.driverID = drivers[i].id;
		si.asgnTaskID.clear();
		for (unsigned int j=0; j<drivers[i].taskList.size(); j++) {
			int idx = drivers[i].taskList[j];
			si.asgnTaskID.push_back(tasks[idx].id);
		}
		schedule.push_back(si);
	}
	return true;
}

