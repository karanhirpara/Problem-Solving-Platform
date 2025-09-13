import express from 'express'
import 'dotenv/config';
import {connectDB} from './conectdb/dbconect.js'
import {Problem} from './model/problem.js'
import {runCppCode} from './compo/coderunner.js'
import {Contest} from './model/contest.js'
import { collect , runner} from './runner/runner.js';
import {updateStatus} from './compo/contestupdate.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userregistration from './compo/user/registration.controllers.js'
import userlogin from './compo/user/login.js'
const port = Number(process.env.PORT) || 3000
const app = express()
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({ origin: '*' }));

app.use(express.json())
console.log("port",port)
await connectDB()

app.post('/problem',  async (req, res) => {
  try {
    const {
      problemName,
      statement,
      input,
      output,
      exampleInput,
      exampleOutput,
      allInput = '',
      allOutput = '',
      note = '',
       contestId
    } = req.body;

    // Check if problem with same name already exists
    const existingProblem = await Problem.findOne({ problemName });
    if (existingProblem) {
      res.status(409).json({
        success: false,
        message: 'Problem with this name already exists'
      });
      return;
    }

    const newProblem = new Problem({
      problemName,
      statement,
      input,
      output,
      exampleInput,
      exampleOutput,
      allInput,
      allOutput,
      note,
      contest: contestId
    }
  
  );

    const savedProblem = await newProblem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: {
        id: savedProblem._id,
        problemName: savedProblem.problemName,
        createdAt: savedProblem.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

//get a problems
app.get('/problemset',async(req, res)=> {
  try {
   const problems = await Problem.find({ visible:false })
  .sort({ createdAt: -1 });// Newest first
  const username= req.cookies.user; 
  console.log(username);
    res.json({
      data:problems
    });
  
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems'
    });
  }
});
app.get('/problems/:id',async(req, res) => {
     const { id } = req.params;
 try {
   const problems = await Problem.find({ _id: id });
    res.json({
      success: true,
      data: problems
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems'
    });
  }
     
})
app.post('/contest', async (req, res) => {
  try {
    const {
      title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    } = req.body;
    
    const newContest = new Contest({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
    });
    const savedContest = await newContest.save();
    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      id:savedContest._id,
      
    });
  }
  catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems'
    });
  }
}
)
app.get('/showcontest', async (req, res)=> {
  try {
    const consests = await Contest.find();
    res.json({
      success: true,
      data: consests
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problems'
    });
  }
});

app.post('/regi',userregistration);
app.post('/login',userlogin);

// // Express route for updating visibility by id (TypeScript

// app.post('/run', async (req, res) => {
//   const { code,lang,problemid} = req.body;
   
//       try{collect(lang,code,problemid);
//       const result = await runner();
//       res.json({
//         success: true,
//         data: result
//       });}
//       catch (error) {
//         console.error('Error running code:', error);
//         res.status(500).json({
    
//           message: 'error in index /run',
          
//         });
//       }
   
// })

// app.get("/updatestatus",async(req,res)=>{
//     try{
//       await updateStatus();
//       res.json({
//         success: true,
//         data: "updated"
//       });
//     }
//     catch (error) {
//       console.error('Error running code:', error);
//       res.status(500).json({
    
//         message: 'error in index /run',
        
//       });
//     }
// })
app.get("/contestproblems/:contestid",async(req,res)=>{
       const {contestid} = req.params;
       try{
        const problems = await Problem.find({contest:contestid});
        res.json({
          success: true,
          data:problems
        });
      }
      catch (error) {
        console.error('Error running code:', error);
        res.status(500).json({
    
          message: 'error in index /run',
          
        });
      }
})
 
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})
