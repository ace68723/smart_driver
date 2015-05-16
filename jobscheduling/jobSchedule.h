#ifndef PARAS_H
#define PARAS_H

#include <string>
#include <vector>
using std::string;
using std::vector;
#define MAXNLOCATIONS  1000

/*
   class CTime
   {
   public: 
   CTime(int minuteToNow):_tMin(minuteToNow){}
   private:
   int _tMin;
   };
 */

typedef int CTime;
typedef int CRTime;
typedef string CID;
#define NULL_ID    ""

typedef CID CLocationID;
class ALG;

class CDriver
{
public:
	CDriver(CID driverID=NULL_ID, CTime availableTime=0, CTime offWorkTime=0, CLocationID availableLoc=NULL_ID)
		:did(driverID), available(availableTime), off(offWorkTime), location(availableLoc){};
	CID 	did;
	/******* may be changed in algorithm: available ********************/
	CTime	available; 
	CTime	off; // when he gets off work
	CLocationID	location;
protected:
	vector<int>	tasksAtHand;
	vector<int>	taskList;
	CTime   origin_available;
	int 	iOrigin_location;
	int	iLocation;
	CTime   finishTime;
	CTime	delayTime;
	friend class ALG;
};

class CTask
{
public:
	CTask(CID taskID=NULL_ID, CLocationID destVenue=NULL_ID, CTime _deadline=0, CTime _readyTime=0, CID asgnDriver=NULL_ID, CID prevTask=NULL_ID)
	       	:tid(taskID), location(destVenue), deadline(_deadline), ready(_readyTime), did(asgnDriver), depend(prevTask){};
	CID 	tid;
	CLocationID	location;
	CTime	deadline; 
	CTime	ready;  // set this to positive values if the driver has to wait when he arrives at the restaurant
	CID	did; //if != NULL_DRIVERID, this task can only be assigned to this driver
	CID	depend; // this task can only start after prevTaskID, and be carried out by the same driver
	//double	profit, penalty; //reserved for adjusting algorithm's behavior
	/******* may be changed in algorithm:  iAsgnDriver ********************/
protected:
	int	iVenue;
	int	iAsgnDriver; //corresponds to asgnDriverID, >= 0 if it appears in driver's tasksAtHand
	int	iDriver; //working index, assigned only this task appears in driver's taskList
	int	iPrevTask;
	int	iNextTask;
	friend class ALG;
};

class CPath
{
public:
	CPath(CLocationID src=NULL_ID, CLocationID dst=NULL_ID, CTime travelTime=0)
	       	:start(src), end(dst), time(travelTime) {};
	CLocationID start; 
	CLocationID end;
	CRTime time;
protected:
	int iSrc, iDst;
	friend class ALG;
};

class CScheduleItem
{ 
public:
	CID did;
	vector<CID>  tids; //the tasks assigned to this driver, in chronological order
	int updated;
	CTime available;
	CLocationID location;
};

//parameter: drivers[in], tasks[in], paths[in], schedule[out]. returns if the scheduling is normal
//the private member of input classes may be altered. 
//abnormal cases include: ...
class ALG{
public:
	static bool findScheduleGreedy(CTime curTime, vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule);
	static bool findScheduleBasic(CTime curTime, vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule);
private:
	static bool preProcess(CTime curTime, vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, int &nLocations);
	static void assignTaskToDriver(int iTask, int iDriver, vector<CDriver> & drivers, vector<CTask> & tasks);
	static bool select_next_task(CDriver & driver, int iDriver, vector<CTask> & tasks, int & iSelectedTask);
	static void arrange_future_tasks(CDriver & driver, vector<CTask> & tasks);
	static double tryAddTask(int iTask, int iDriver, CDriver & driver, vector<CTask> & tasks);
	//return how good to choose (the new task) iTask as the next task, 
	//return 0 if infeasible or the next job at hand is better chosen as the next task
	static void calDFTime(int iStart, int iEnd, CDriver & driver, vector<CTask> & tasks, int curLoc, CTime & dTime, CTime & fTime);
	static double map[MAXNLOCATIONS][MAXNLOCATIONS];
};
#endif
