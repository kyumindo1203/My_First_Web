
import './App.css';
import { useState } from 'react'
import './1.css';
import { useRef } from 'react';
import './2.css';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';



// >>> "npm start" <- 터미널에다가 입력 

// const fs = require('fs');
// fs.readFile('./save.json')




// function load() {
//   fetch("http://localhost:3002/api/contents", {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => response.json())
//     .then(datum => {

//       console.log("데이터:", datum["message"])
//       App({data:datum["message"]})

//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//       }
//     })

// }


// const loads = new Promise((resolve, reject) => {
//   fetch("http://localhost:3002/api/contents", {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     }
//     .then(response => response.json())
//     .then(datum => {

//       console.log("데이터:", datum["message"])
//       resolve(datum['message'])
//     })
//     .catch(err => {
//       if (err) {
//         console.log(err)
//         reject("err")
//       }
//     })
//   })

// })



// const loads = () => {
//   return new Promise((resolve, reject) => {
//     fetch("http://localhost:3002/api/contents", {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json'
//       }
//       .then(response => response.json())
//       .then(datum => {

//         console.log("데이터:", datum["message"])
//         resolve(datum['message'])
//       })
//       .catch(err => {
//         if (err) {
//           console.log(err)
//           reject("err")
//         }
//       })
//     })
//   })
// }




// async function load() {
//   let [data, datas] = useState(await loads())
//   console.log(data)


// }


function load() { ///// 2시간 반만에 성공 ㅠㅠㅠㅠㅠㅠㅠㅠ
  fetch("http://localhost:3002/api/contents", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(datum => {

      console.log("데이터:", datum["message"])
      // return(
      //   <App data={datum["message"]}/>
      // )
      ReactDOM.render(<App data={datum["message"]} />, document.getElementById('root')); ///////// Key Point
      // App({data:datum["message"]})

    })
    .catch(err => {
      if (err) {
        console.log(err)
      }
    })

}


function App(props) {

  console.log("프롭스:", props.data)


  let [main, setMain] = useState(true);
  let [login, setLogin] = useState(false);
  let [register, setRegister] = useState(false);
  let [info, setInfo] = useState(null);
  let [isLogin, setIsLogin] = useState(false);
  if (login) {
    return (
      <Login main={main} setMain={setMain} login={login} setLogin={setLogin} register={register} setRegister={setRegister} info={info} setInfo={setInfo} setIsLogin={setIsLogin}></Login>
    )
  }
  if (register) {
    return (
      <Register main={main} setMain={setMain} register={register} setRegister={setRegister}></Register>
    )
  }
  return (
    main ? <Main data={props.data} main={main} setMain={setMain} login={login} setLogin={setLogin} register={register} setRegister={setRegister} info={info} setInfo={setInfo} setIsLogin={setIsLogin} isLogin={isLogin}></Main> : console.log('off', login)

  );

}

function Main(props) {

  let [datas, setDatas] = useState(props.data["data"]);
  let [modal, setModal] = useState(false);
  let [index, setIndex] = useState(undefined);
  let [write, setWrite] = useState(false)
  let [profile, setProfile] = useState(false)


  fetch("http://localhost:3002/api/uploadCont", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datas)
  })
    .then(response => response.json())
    .then(data => {
      console.log("쓴 글들:", data)
    })
    .catch(err => {
      if (err) {
        alert(err)
      }
    })

  return (
    <div>
      {props.isLogin ?
        <div className="black-nav">
          <div className='site_title'>
            <h3>영진고등학교 과목소개</h3>
          </div>
          <button style={{ backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", marginRight: "2px" }} onClick={() => {
            setWrite(true)
          }}>글쓰기</button>
          <div className='profile'>
            <h3><sapn style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}>{props.info["name"]}님 환영합니다!</sapn></h3>
            <button style={{ background: "#10bad8f6", width: "100%", height: "73%" }} onClick={() => {
              setProfile(true)
              profile ? setProfile(false) : setProfile(true);

            }}>프로필 보기</button>
          </div>


        </div>


        :
        <div className="black-nav">
          <h3>영진고등학교 과목소개</h3>
          <div style={{ marginLeft: "80%", display: "flex" }}>
            <button className='login_btn' onClick={() => {
              props.setMain(false);
              props.setLogin(true);

            }}><span color='white'>로그인</span></button>
            <button className='login_btn' onClick={() => {
              props.setMain(false);
              props.setRegister(true);

            }}><span color='white'>회원가입</span></button>

          </div>

        </div>

      }



      {datas.map((row, i) => {
        //console.log(row, i)
        return (
          <div className='list'>

            <div className='title' onClick={() => {
              modal ? setModal(false) : setModal(true);
              setIndex(i);
            }}>{row.title + "-" + row.userName}</div>
            <div className='contents'>{row.content}</div>

          </div>
        )
      })}
      {modal ? <Modal modal={modal} setModal={setModal} index={index} data={datas} setDatas={setDatas}></Modal> : ''}
      {
        write ? <Write write={write} setWrite={setWrite} data={datas} setDatas={setDatas} info={props.info} setInfo={props.setInfo}></Write> : ""
      }
      {
        profile ? <Profile profile={profile} setProfile={setProfile} index={index} info={props.info} setInfo={props.setInfo} setIsLogin={props.setIsLogin}></Profile> : ""
      }
    </div>
  );
}


function Write(props) {
  let [title, setTitle] = useState('')
  let [content, setContent] = useState('')
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  return (
    <div className='modal'>
      <div className='modal-body' style={{ justifyContent: "center" }}>
        <div><h1 style={{ fontSize: "50px", fontWeight: "bolder" }}>글쓰기</h1></div>

        <div style={{ marginTop: '15px' }}>
          <div style={{ justifyContent: "center" }}>
            <h1>글 제목</h1>
            <input ref={titleRef} type='text' style={{ width: "150px", fontSize: "20px", backgroundColor: "white", borderStyle: "solid", borderWidth: "1px" }} onChange={
              (e) => {
                setTitle(e.target.value)
              }
            } />
          </div>
          <div style={{ marginTop: '15px' }}>
            <h1>글 내용</h1>
            <textarea ref={contentRef} style={{ backgroundColor: 'white', borderStyle: "solid", borderWidth: "1px", resize: 'none', width: '450px', height: "200px" }} onChange={
              (e) => {
                setContent(e.target.value)
              }
            } />
          </div>
        </div>

        <button style={{
          marginTop: '10px',
          width: '300px',
          height: '30px',
          backgroundColor: '#61dafb',
          border: '0px',
          borderRadius: "2px",
          justifyContent: "center"
        }} onClick={() => {

          if (titleRef.current.value.length == 0) {
            alert("제목을 입력하세요")
          }
          else if (
            contentRef.current.value.length == 0
          ) {
            alert("내용을 입력하세요")
          }
          else {
            const currentDate = new Date();
            const year = currentDate.getFullYear(); // 현재 연도
            const month = currentDate.getMonth() + 1; // 현재 월 (0부터 시작하므로 +1을 해줌)
            const day = currentDate.getDate(); // 현재 일
            const hours = currentDate.getHours(); // 현재 시간 (24시간 형식)
            const minutes = currentDate.getMinutes(); // 현재 분
            const seconds = currentDate.getSeconds(); // 현재 초
            let dataaaaa = {
              id: props.data.length,
              title: title,
              date: year + "-" + month + "-" + day,
              content: content,
              like: 0,
              userID: props.info["userID"],
              userName:props.info["name"]
            }

            let copy = [...props.data];
            // alert(props.info["userID"])
            copy.unshift(dataaaaa)

            props.setDatas(copy)


            props.setWrite(false)
          }

        }}>저장</button>
        <button style={{
          marginTop: '10px',
          width: '300px',
          height: '30px',
          backgroundColor: '#61dafb',
          border: '0px',
          borderRadius: "2px",
          justifyContent: "center"
        }} onClick={
          () => { props.setWrite(false) }
        }>취소</button>

      </div>
    </div>
  )
}

function Profile(props) {
  let [modify, setModify] = useState([false, false, false]);
  let [content, setContent] = useState([props.info["name"], props.info["birth"], props.info["SNS"]])
  const nameRef = useRef(null)
  const birthRef = useRef(null)
  const snsRef = useRef(null)

  function textChange(props2, index) {

    const val = [content[0], content[1], content[2]]

    val[index] = props2.target.value

    setContent(val);
  }


  return (
    <div className='modal'>
      <div className='modal-body' style={{ paddingTop: "0px" }}>

        <div>
          <h1 style={{ fontSize: "50px", color: "#08007e", fontWeight: "bold" }}>프로필</h1>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {
            modify[0] ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h1>이름</h1>
                <input ref={nameRef} type={"text"} value={content[0]} onChange={(event) => textChange(event, 0)} style={{ backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", fontSize: "20px", width: "150px" }} />
              </div>
            ) : (
              <h1>이름:{content[0]}</h1>
            )
          }

          <button style={{ backgroundColor: "#e7e7e7", marginLeft: "30px", height: "30px", width: "50px", borderStyle: "solid", borderWidth: "2px" }} onClick={() => {
            if (modify[0]) {
              if (nameRef.current.value.length < 2) {
                alert("이름은 두글자 이상이여야 합니다.")
              }
              else {
                setModify([!modify[0], modify[1], modify[2]])
              }
            }
            else {
              setModify([!modify[0], modify[1], modify[2]])

            }

          }}>{modify[0] ? "저장" : "수정"}</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {
            modify[1] ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h1>생년월일</h1>
                <input ref={birthRef} type={"text"} value={content[1]} onChange={(event) => textChange(event, 1)} style={{ backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", fontSize: "20px", width: "150px" }} />
              </div>
            ) : (
              <h1>생년월일:{content[1]}</h1>

            )
          }
          <button style={{ backgroundColor: "#e7e7e7", marginLeft: "30px", height: "30px", width: "50px", borderStyle: "solid", borderWidth: "2px" }} onClick={() => {
            if (modify[1]) {
              if (!(birthRef.current.value.length == 8)) {
                alert("생년월일은 8글자여야합니다.")
              }
              else if (parseInt(birthRef.current.value.slice(0, 4)) > 2022) {
                alert("나이가 음수인가요?")

              }
              else if (!(parseInt(birthRef.current.value.slice(4, 6)) < 13 && parseInt(birthRef.current.value.slice(4, 6)) > 0)) {
                alert("일년은 몇 개월로 되어있는지 알아오세요")

              }
              else if ((!(parseInt(birthRef.current.value.slice(6, 8)) < 32 && parseInt(birthRef.current.value.slice(6, 8)) > 0))) {
                alert("한달은 31일까지입니다 ^^")

              }
              else {
                console.log("길이:", birthRef.current.value.length, !(birthRef.current.value.length == 8))
                setModify([modify[0], !modify[1], modify[2]])
              }
            }
            else {
              setModify([modify[0], !modify[1], modify[2]])
            }






          }}>{modify[1] ? "저장" : "수정"}</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>

          {
            modify[2] ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h1>SNS</h1>
                <input ref={snsRef} type={"text"} value={content[2]} onChange={(event) => textChange(event, 2)} style={{ backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", fontSize: "20px", width: "150px" }} />
              </div>
            ) : (
              <h1>SNS:{content[2]}</h1>
            )
          }

          <button style={{ backgroundColor: "#e7e7e7", marginLeft: "30px", height: "30px", width: "50px", borderStyle: "solid", borderWidth: "2px" }} onClick={() => {

            setModify([modify[0], modify[1], !modify[2]])


          }}>{modify[2] ? "저장" : "수정"}</button>
        </div>

        {
          props.info["userID"] == "7e62a97a7671d0a63e6b4c1cb73ecf6666abc63e95b26467337bcc15bb509a86" ?
            <div>
              <h1>프로필 사진</h1>
              <img src='/img/8816475a3a2d9a28b1c3c1d7c1267af0537f4eec_s2_n3_y1.jpg' style={{ width: "17%" }}></img>
            </div>
            :               
            <h1>프로필 사진</h1>

        }




        <button className='modal-button' onClick={() => {

          const data = {
            contents: content
          }
          fetch("http://localhost:3002/api/upload", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'user-id': props.info["userID"],
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(data => {
              const userInfo = data["userInfo"]
              props.setInfo(userInfo)

            })
            .catch(err => {
              if (err) {
                alert(err)
              }
            })
          console.log(props.info["userID"], content)
          props.setProfile(false)

        }}>확인</button><br />
        <button id='modify' className='modal-button' onClick={() => {
          const res = window.confirm("정말로 로그아웃 하시겠습니까?");
          if (res) {
            props.setIsLogin(false)
            props.setProfile(false)
          }

        }}>로그아웃</button><br />
        {/* <button className='modal-button' onClick={() => {
          props.setProfile(false);
        }}>삭제</button> */}

      </div>
    </div>
  )
}





function Modal(props) {
  let [modify, setModify] = useState(false);
  let [content, setContent] = useState('')

  function text_change(props2) {
    setContent(props2.target.value);

  }


  return (
    <div className='modal'>
      <div className='modal-body'>


        <div className='modal-title'>{props.data[props.index].title}</div>
        {modify ? <div className='modal-content'><textarea className='modify-content' value={content} onChange={text_change} /></div> :
          <div className='modal-content'>{props.data[props.index].content}</div>
        }
        <div>
          {props.data[props.index].date},
          <span className='modal-like'>👍</span>
          <span >{props.data[props.index].like}</span>
        </div>
        <button className='modal-button' onClick={() => props.setModal(false)}>확인</button><br />
        <button id='modify' className='modal-button' onClick={() => {
          if (!modify) {
            setContent(props.data[props.index].content)
            setModify(!modify);

          }
          else {
            let copy = [...props.data]
            copy[props.index].content = content
            props.setDatas(copy)
            setModify(!modify);

          }
        }}>{modify ? '저장' : '수정'}</button><br />
        <button className='modal-button' onClick={() => {
          let copy = [...props.data];
          copy.splice(props.index, 1);
          props.setDatas(copy);
          props.setModal(false);
        }}>삭제</button>

      </div>
    </div>
  )
}

function Login(props = '') {
  const idRef = useRef(null);
  const pwRef = useRef(null);
  const loginPs = () => {
    if (idRef.current && pwRef.current) {
      const idV = idRef.current.value
      const pwV = pwRef.current.value

      fetch("http://localhost:3002/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': idV,
          'User-Pw': pwV
        }



      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const errCode = data["err"]
          const p = data["message"]
          const userInfo = data["userInfo"]

          if (errCode == 0) {
            alert(p)
            console.log(userInfo)
            props.setInfo(userInfo)
            props.setIsLogin(true)
            props.setLogin(false)
            props.setMain(true)
          }
          else {
            alert(p)
            console.log(userInfo)
          }

        })
        .catch(err => {
          if (err) {
            console.log(err)
          }
        })
      console.log(idV, pwV)


      // props.setLogin(false)
      // props.setMain(true)
    }

  }

  return (
    <div>


      <div className='header_custom'>
        로그인
      </div>

      <div className="login_wrap">


        <ul className="panel_wrap">
          <li className="panel_item" style={{ display: "block" }}>
            <div className="panel_inner" role="tabpanel" aria-controls="loinid">
              <div className="id_pw_wrap">
                <div className="input_row" id="id_line">
                  <div className="icon_cell" id="id_cell">
                    <span className="icon_id">
                      <span className="blind">아이디</span>
                    </span>
                  </div>
                  <input type="text" id="id" name="id" ref={idRef} placeholder="아이디" title="아이디" className="input_text"
                    maxlength="41" />

                </div>
                <div className="input_row" id="pw_line">
                  <div className="icon_cell" id="pw_cell">
                    <span className="icon_pw">
                      <span className="blind">비밀번호</span>
                    </span>
                  </div>
                  <input type="password" id="pw" name="pw" ref={pwRef} placeholder="비밀번호" title="비밀번호"
                    className="input_text" maxlength="16" />
                  <span role="button" className="btn_delete" id="pw_clear" style={{ display: 'none' }}>
                    <span className="icon_delete">
                      <span className="blind">삭제</span>
                    </span>
                  </span>
                </div>
              </div>

              <div className="btn_login_wrap">

                <button type="submit" className="btn_login" id="log.login" onClick={loginPs}>
                  <span className="btn_text">로그인</span>
                </button>

              </div>

              <div className="btn_login_wrap">

                <button type="submit" className="btn_login" id="log.login" onClick={() => {
                  props.setLogin(false)
                  props.setRegister(true)
                }}>
                  <span className="btn_text">회원가입</span>
                </button>


              </div>

            </div>
          </li>
        </ul>

      </div>
    </div>
  )
}

function Register(props = '') {
  const idRRef = useRef(null)
  const pwRRef = useRef(null)
  const naRRef = useRef(null)
  const biRRef = useRef(null)
  let [gender, setGender] = useState(null)
  const changeGender = (event) => {
    setGender(event.target.value)
  }


  const registPs = () => {


    if (idRRef.current && pwRRef.current && naRRef.current && biRRef.current && gender) {
      if (idRRef.current.value.length < 8) {
        alert("아이디 8자리 이상");
      }
      else if (pwRRef.current.value.length < 8) {
        alert("비번 8자리 이상")
      }
      else if (naRRef.current.value.length < 2) {
        alert("이름 2자리 이상")
      }
      else if (!(biRRef.current.value.length == 8)) {
        alert("생년월일 8자리")
      }
      else if (parseInt(biRRef.current.value.slice(0, 4)) > 2022) {
        alert("나이가 음수인가요?")
      }
      else if (!(parseInt(biRRef.current.value.slice(4, 6)) < 13 && parseInt(biRRef.current.value.slice(4, 6)) > 0)) {
        alert("일년은 몇 개월로 되어있는지 알아오세요")
      }
      else if ((!(parseInt(biRRef.current.value.slice(6, 8)) < 32 && parseInt(biRRef.current.value.slice(6, 8)) > 0))) {
        alert("한달은 31일까지입니다 ^^")
      }
      else if ((/[ㄱ-ㅎ ㅏ-ㅣ 가-힣]/.test(idRRef.current.value))) {
        alert("아이디는 공백 없이 영어로 입력하세요")
      }
      else {
        //alert("가입 성공")
        console.log(idRRef.current.value, pwRRef.current.value, naRRef.current.value, biRRef.current.value, gender)

        const userInfo = {
          pw: pwRRef.current.value,
          name: naRRef.current.value,
          birth: biRRef.current.value,
          gender: gender,
          SNS: "",
          photo: ""
        };
        const convertJsonForm = JSON.stringify(userInfo);
        console.log(convertJsonForm)


        fetch("http://localhost:3002/api/data", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-ID': idRRef.current.value
          },
          body: convertJsonForm
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if (data["err"] == 1) {
              alert(data["message"])
            }
            else {
              alert(data["message"])
              props.setRegister(false);
              props.setMain(true);
            }
          })
          .catch(err => { console.log(err) })

        // const fileSave = require('fs');
        // fileSave.wirteFile('./save.json', convertJsonForm, 'utf8', (err) =>{
        //   if(err){
        //     console.error(err);
        //     return;
        //   }
        //   console.log("successful!!")
        // });

      }
    }
    else {
      alert("성별 입력")
    }
  }


  return (
    <div>
      <div className='header_custom'>
        회원가입
      </div>

      <div className="inner">
        <div className="content">


          <div className="form_content">
            <div className="form_section">
              <div className="form_list">
                <div className="form_item user" id="divId">
                  <input type="text" id="id" name="id" placeholder="아이디" className="input" maxlength="20" ref={idRRef}
                    autocapitalize="off" />
                  <div className="id_naver"></div>
                </div>
                <div className="form_item lock password" id="divPasswd">
                  <input type="password" id="pswd1" name="pswd1" placeholder="비밀번호" className="input" ref={pwRRef}
                    maxlength="20" autocomplete="new-password" />
                </div>
              </div>

              <div className="form_list">

                <div className="form_item user" id="divName">
                  <input type="text" id="name" name="name" placeholder="이름" className="input" ref={naRRef}
                    maxlength="40" />
                </div>
                <div className="form_item calendar" id="divBirthday">
                  <input type="text" id="birthdayInput" placeholder="생년월일 8자리" className="input" ref={biRRef}
                    maxlength="10" />
                </div>

                <div className="form_item adult" id="divIdentityGender">
                  <li className="radio_item" style={{ width: "150px" }}>
                    <input type="radio" id="identityGender1" name="identityGender" value="M" className="blind" onClick={changeGender} />
                    <label for="identityGender1">남자</label>
                  </li>
                  <li className="radio_item" style={{ width: "150px" }}>
                    <input type="radio" id="identityGender2" name="identityGender" value="F" className="blind" onClick={changeGender} />
                    <label for="identityGender2">여자</label>
                  </li>


                </div>




              </div>
            </div>

            <div className="btn_submit_wrap" id="divBtnAuth">
              <button type="button" className="btn_submit" id="btnSend" onClick={registPs}>가입하기</button>
              <button type="button" className="btn_submit" id="btnSend" onClick={() => {
                props.setRegister(false);
                props.setMain(true);
              }}>메인으로</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default load
