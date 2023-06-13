const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs');
const { rejects } = require('assert');
const { json } = require('express');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());



function Hash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data)
  return hash.digest('hex')
}


const loadSave = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./save.json", 'utf8', (err, data) => {
      if (err) {
        console.error(err, "4");
        reject(err);
        return;
      }
      const jsonData = JSON.parse(data);
      console.log(jsonData, "4-1")

      const idArr = []
      for (const key in jsonData["User"]) {
        console.log(key)
        idArr.push(key)

      }
      console.log([jsonData, idArr], "4-10")
      resolve([jsonData, idArr]);
    })
  })
}


app.post("/api/contents", async (req, res) => {
  console.log("실행됨!!")
  const data = req.headers

  const jsonData_ = await loadSave()
  const jsonData = jsonData_[0]

  fs.readFile("./data.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err, "4");
      return
    }
    var contentsData = JSON.parse(data);
    console.log("음!!",contentsData['data'])
    
    for(const key in contentsData['data']){
      console.log("키",key)
      if(jsonData_[1].includes(contentsData['data'][key]["userID"])){
        contentsData['data'][key]["userName"] = jsonData["User"][contentsData['data'][key]["userID"]]["name"]
      }
      else{
        contentsData['data'][key]["userName"] = "<unKnown>"
      }

    }
    
    var responseData = {
      message: contentsData
    }
    console.log("컨텐츠 데이터",contentsData)

    res.json(responseData)

  })

})


app.post('/api/uploadCont', async(req, res) => {
  const contents = req.body;
  const jsonData_ = await loadSave()
  const jsonData = jsonData_[0]
  console.log("받은 정보",contents)
  var uploadData = {"data":[]}
  for(const i of contents){
    if(i.userName){
      delete i.userName 
    }
    uploadData["data"].push(i)

  }
//   console.log("업로드 파일:",uploadData)
//   var uploadData = JSON.stringify(uploadData_, null, 4)

//   fs.writeFile('./data.json', uploadData, 'utf8', (err) => {
//     if (err){
//       console.log(err)
//       return;
//     }
//     res.json({message:0})

//   
// })
  writeFileAsync('./data.json', uploadData)

async function writeFileAsync(filePath, data) {
  try {
    const stringifiedData = JSON.stringify(data, null, 4);
    await fs.promises.writeFile(filePath, stringifiedData);
    console.log('파일 쓰기 완료');
    res.json({message:0})
  } catch (error) {
    console.error('파일 쓰기 오류:', error);
  }
}})


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/api/login', async (req, res) => {
  const userID = Hash(req.headers['user-id'])
  const userPW = req.headers['user-pw']
  console.log(userID, userPW, "10")
  var jsonData = await loadSave()
  console.log(jsonData, "11")
  const jsonData_ = jsonData[0]
  const idArr = jsonData[1]

  if (jsonData == null) {
    return;
  }
  else {
    if (idArr.includes(userID)) {
      if (jsonData_["User"][userID]["pw"] == Hash(userPW)) {
        console.log("로그인 성공!")
        var responseData = {
          message: "로그인을 성공하였습니다.!",
          userInfo: {
            userID: userID,
            name: jsonData_["User"][userID]["name"],
            birth: jsonData_["User"][userID]["birth"],
            gender: jsonData_["User"][userID]["gender"],
            SNS: jsonData_["User"][userID]["SNS"],
            photo: jsonData_["User"][userID]["photo"]
          },
          err: 0
        }
      }
      else {
        console.log("비번 틀림")
        var responseData = {
          message: "해당 계정이 존재하지 않거나 비밀번호가 틀렸습니다.",
          userInfo: {
            name: null,
            birth: null,
            gender: null
          },
          err: 1
        }
      }
    }
    else {
      console.log("해당 아이디가 없습니다!")
      var responseData = {
        message: "해당 계정이 존재하지 않거나 비밀번호가 틀렸습니다.",
        userInfo: {
          name: null,
          birth: null,
          gender: null
        },
        err: 1
      }
    }
  }
  res.json(responseData)





})


app.post('/api/upload', async (req, res) => {


  const data = req.body;
  console.log("데이터는 이거야!!!!", data)
  const userID = req.headers['user-id']
  var jsonData = await loadSave()
  jsonData[0]["User"][userID]["name"] = data['contents'][0]
  jsonData[0]["User"][userID]["birth"] = data['contents'][1]
  jsonData[0]["User"][userID]["SNS"] = data['contents'][2]
  jsonData[0]["User"][userID]["photo"] = ''

  console.log("결과!!", jsonData[0])

  var uploadData = JSON.stringify(jsonData[0], null, 4)

  fs.writeFile('./save.json', uploadData, 'utf8', (err) => {
    if (err) {
      console.error(err, "5");
      return;
    }
    console.log('JSON File updated successfully!', "6")
    const responseData = {
      err: 0,
      userInfo: {
        userID: userID,
        name: jsonData[0]["User"][userID]["name"],
        birth: jsonData[0]["User"][userID]["birth"],
        gender: jsonData[0]["User"][userID]["gender"],
        SNS: jsonData[0]["User"][userID]["SNS"],
        photo: jsonData[0]["User"][userID]["photo"]
      }
    };
    res.json(responseData);

  })
})

app.post('/api/data', async (req, res) => {

  // console.log(req)

  const requestData = req.body;//JSON.parse(req.body);
  // const requestJsonData = JSON.stringify(requestData);
  const userID = req.headers['user-id']
  console.log(requestData, "1");
  console.log(userID, "3")



  var jsonData_ = await loadSave()
  if (jsonData_ == null) {
    return;
  }
  const jsonData = jsonData_[0]
  const idArr = jsonData_[1]
  console.log(idArr, "4-4")
  console.log(userID, idArr, userID in idArr)
  // console.log(typeof jsonData, typeof requestData, typeof requestJsonData, typeof userID, "4-2");
  if (idArr.includes(Hash(userID))) {
    console.log("아이디가 중복됩니다!!")
    const responseData = {
      message: "해당 아이디가 이미 존재합니다.",
      err: 1
    };
    res.json(responseData);

    return;
  }
  else {
    var pw = requestData["pw"]
    jsonData["User"][Hash(userID)] = requestData
    jsonData["User"][Hash(userID)]["pw"] = Hash(pw)

    uploadData = JSON.stringify(jsonData, null, 4)



    fs.writeFile('./save.json', uploadData, 'utf8', (err) => {
      if (err) {
        console.error(err, "5");
        return;
      }
      console.log('JSON File updated successfully!', "6")
      const responseData = {
        err: 0,
        message: "가입 성공!"
      };
      res.json(responseData);

    })

  }





})



const port = 3002;
app.listen(port, () => {
  console.log('Server is running on port 3002');
});