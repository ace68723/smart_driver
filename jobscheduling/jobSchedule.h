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
//how to define a NULL string?

typedef CID CLocationID;
class ALG;

class CDriver
{
public:
	CDriver(CID driverID=NULL_ID, CTime availableTime=0, CTime offWorkTime=0, CLocationID availableLoc=NULL_ID)
		:id(driverID), avlbTime(availableTime), offTime(offWorkTime), avlbLocation(availableLoc){};
	CID 	id;
	CTime	avlbTime; 
	CTime	offTime; // when he gets off work
	CLocationID	avlbLocation;
	/******* may be changed in algorithm: avlbTime ********************/
protected:
	vector<int>	tasksAtHand;
	vector<int>	taskList;
	int	iLocation;
	CTime   finishTime;
	CTime	delayTime;
	friend class ALG;
};

class CTask
{
public:
	CTask(CID taskID=NULL_ID, CLocationID destVenue=NULL_ID, CTime _deadline=0, CTime _readyTime=0, CID asgnDriver=NULL_ID, CID prevTask=NULL_ID)
	       	:id(taskID), venue(destVenue), deadline(_deadline), readyTime(_readyTime), asgnDriverID(asgnDriver), prevTaskID(prevTask){};
	CID 	id;
	CLocationID	venue;
	CTime	deadline; 
	CTime	readyTime;  // set this to positive values if the driver has to wait when he arrives at the restaurant
	CID	asgnDriverID; //if != NULL_DRIVERID, this task can only be assigned to this driver
	CID	prevTaskID; // this task can only start after prevTaskID, and be carried out by the same driver
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
	       	:source(src), dest(dst), dist(travelTime) {};
	CLocationID source; 
	CLocationID dest;
	CRTime dist;
protected:
	int iSrc, iDst;
	friend class ALG;
};

class CScheduleItem
{ 
public:
	CID driverID;
	vector<CID>  asgnTaskID; //the tasks assigned to this driver, in chronological order
};

//parameter: drivers[in], tasks[in], paths[in], schedule[out]. returns if the scheduling is normal
//the private member of input classes may be altered. 
//abnormal cases include: ...
class ALG{
public:
	static bool findScheduleGreedy(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule);
	static bool findScheduleBasic(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, vector<CScheduleItem> &schedule);
private:
	static bool preProcess(vector<CDriver> & drivers, vector<CTask> & tasks, vector<CPath> & paths, int &nLocations);
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
