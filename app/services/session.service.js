const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { messages } = require("../response/customMessages");
const { APsession } = require("../models/APsessions");
const moment = require("moment-timezone");
const dateList = (type, params) => {
    
    let report = {};
    console.log(type);
    if (type == "WEEK") {
        // const currentDate = moment();

        // // Get the number of weeks in the current month
        // const weeksInMonth = currentDate.clone().endOf('month').week();
        // console.log('weeksInMonth',weeksInMonth)
        // // Initialize the start date for the first week
        // let startDate = currentDate.clone().startOf('month');
        
        // // Loop through the weeks and calculate the start and end dates
        // for (let weekNumber = 1; weekNumber <= weeksInMonth; weekNumber++) {
        //   // Calculate the end date for the current week
        //   const endDate = startDate.clone().endOf('week');
        
        //   console.log(`Week ${weekNumber}:`);
        //   console.log('Start Date:', startDate.format('YYYY-MM-DD'));
        //   console.log('End Date:', endDate.format('YYYY-MM-DD'));
        //   console.log('-----------------------');
        //  let d ='week '+weekNumber
        //   report[d] = {
        //     text: d,
        //     date: {
        //       start: moment(startDate).format("YYYY-MM-DDT00:00:00.000"),
        //       end: moment(endDate).format("YYYY-MM-DDT23:59:59.000"),
        //     },
        //     resp: {},
        //   };

        //   // Move to the next week
        //   startDate = endDate.clone().add(1, 'day');
        // }






        const currentMonth = moment();

        // Create an array to store the weeks
        const weeks = [];
        
        // Start with the first day of the current month
        let currentWeekStart = currentMonth.clone().startOf('month').startOf('week');
        let weekCount=1
        // Iterate through the weeks in the current month
        while (currentWeekStart.isBefore(currentMonth.clone().endOf('month'))) {
          const currentWeekEnd = currentWeekStart.clone().endOf('week');
          weeks.push({
            start: currentWeekStart.format('YYYY-MM-DD'),
            end: currentWeekEnd.format('YYYY-MM-DD'),
          });
            let d ='week '+weekCount
            weekCount ++
          report[d] = {
            text: d,
            date: {
              start: moment(currentWeekStart).format("YYYY-MM-DDT00:00:00.000"),
              end: moment(currentWeekEnd).format("YYYY-MM-DDT23:59:59.000"),
            },
            resp: {},
          };
          currentWeekStart.add(1, 'week');
        }
        console.log('weeks',weeks)
    }
    else if(type == "MONTH") {
      let start_day = new Date(
        new Date(params.startDate).setHours(0, 0, 0, 0)
      ).getTime();
      let st_day = start_day;
      let end_day = new Date(
        new Date(params.endDate).setHours(23, 59, 59, 0)
      ).getTime();
      while (st_day < end_day) {
        var d = moment(st_day).format("YYYY-MM-DD");
        report[d] = {
          text: d,
          date: {
            start: moment(d).format("YYYY-MM-DDT00:00:00.000"),
            end: moment(d).format("YYYY-MM-DDT23:59:59.000"),
          },
          resp: {},
        };
        st_day += 24 * 60 * 60 * 1000;
      }
    }
    else
    {
      //week
      let start_day = new Date(
        new Date(params.startDate).setHours(0, 0, 0, 0)
      ).getTime();
      let st_day = start_day;
      let end_day = new Date(
        new Date(params.endDate).setHours(23, 59, 59, 0)
      ).getTime();
      while (st_day < end_day) {
        var d = moment(st_day).format("YYYY-MM-DD");
        report[d] = {
          text: d,
          date: {
            start: moment(d).format("YYYY-MM-DDT00:00:00.000"),
            end: moment(d).format("YYYY-MM-DDT23:59:59.000"),
          },
          resp: {},
        };
        st_day += 24 * 60 * 60 * 1000;
      }
    }
    return report;
  };
const loginCountService = async (params) => {
  let startDate = moment().startOf("day").toISOString();
  let endDate = moment().endOf("day").toISOString();
  let aggregateQuery = [
    {
      $match: {
        loggedInAt: { $lte: new Date(endDate), $gte: new Date(startDate) },
      },
    },
    {
      $group: {
        _id: "",
        uniqueValues: { $addToSet: "$APId" } ,
        count: { $sum: 1 },
      },
    },
  ];
  let countResp = await APsession.aggregate(aggregateQuery);
  console.log("countResp", countResp);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: countResp?.[0]?.count || 0
  };
};
const loginActivityReportService = async (params) => {
  if (params.type == "MONTH") {
    params.startDate = moment(new Date()).startOf("month").toISOString();
    params.endDate = moment(new Date()).endOf("month").toISOString();
  } else if (params.type == "WEEK") {
    params.startDate = moment(new Date()).startOf("week").toISOString();
    params.endDate = moment(new Date()).endOf("week").toISOString();
  }
  let result = dateList(params.type, params);
  var getData = async (d) => {
    
    

    let aggregateQuery = [
      {
        $match: {
       
          loggedInAt: { $lte: new Date(result[d].date.end), $gte: new Date(result[d].date.start) },
        },
      },
      {
        $group: {
          _id: null,
          uniqueValues: { $addToSet: "$APId" } ,
          count: { $sum: 1 },
        },
      },
    ];
    
    let countData = await APsession.aggregate(aggregateQuery);
   
    result[d].resp.count = countData?.[0]?.count || 0;
  };
  await Promise.all(Object.keys(result).map(getData));

  let x_axis = []
  let x_axis_value = []
  let y_axis = [
    {
      name: "Count",
      data: []
    },
   
  ]
  Object.keys(result).forEach((date) => {
    y_axis[0].data.push(result[date].resp.count || 0)
    x_axis.push(date)
    x_axis_value.push(result[date].text)
  })
  let result1 = {
    x_axis: x_axis,
    x_axis_value: x_axis_value,
    y_axis: y_axis,
  }
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: result1
  };

};

module.exports = {
  loginCountService,
  loginActivityReportService,
};
