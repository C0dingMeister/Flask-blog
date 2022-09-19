import React,{useState} from 'react';

import { Link, useNavigate } from 'react-router-dom';


function Sidebar(props) {
  const [error, setError] = useState()
  const [subscribe, setSubscribe] = useState()

  const handleClick = (e) => {
    const formData = new FormData();
    let input = document.querySelector('input[type="file"]')

    formData.append('avatar', input.files[0]);
    let file = input.files[0]
    console.log(file)
    if (file.type !== 'image/png') {
      setError("You can only upload PNG images")
      e.target.value = null
      console.log("upload png only")
    }
    else {
      console.log("correct")
      setError(null)
      const uploadPic = () => {
        let options = {
          method: "PUT",
          body: formData,
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
        }
        fetch("http://localhost:5000/setdp", options)
          .then((resp) => { return resp.json() })
          .then((result) => { props.setDp(result.dp) })
          .catch((err) => { console.log(err) })

      }
      uploadPic()
    }

    e.target.value = null
  }
  const navigate = useNavigate()

  const logout = () => {
    props.setUser(null)
    props.setDp(null)
    localStorage.removeItem("access_token")
    navigate('/login')
  }

  const notification = async () => {
    if (subscribe) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((subscription) => {
          subscription.unsubscribe().then((successful) => {
            console.log(successful)
            setSubscribe(false)
          }).catch((e) => {
            // Unsubscribing failed
          })
        })
      });
    }
    else {

      const publicKey = "BIWiaQ4_PfE50maGN54-91QglRCyxlZaehIltGsvVyi1nWJndsfMAE7BExLOc_dodtrIpE9dIrybPbwGe2uxaAQ";
      const reg = await navigator.serviceWorker.register("sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
      console.log(JSON.stringify(sub))
      setSubscribe(true)
    }

  }
  return (
    <>
      <nav id="sidebar">
        <div className="sidebar-header">
          <h3>BlogHub</h3>
        </div>

        <ul className="list-unstyled components">

          {props.user &&
            <>
              <div className="" style={{ margin: "5px 0px" }}>
                <img src={"http://localhost:5000/" + props.dp} width={120} height={120} style={{ borderRadius: "50%", marginLeft: "55px" }} id='profile' />
                <label style={{ margin: "10px 35px 0px", paddingTop: "25px" }} htmlFor="file"><i className="fa fa-edit"></i>Change Profile Pic</label>
                <input type={"file"} name="file" id="file" accept=".png" onChange={(e) => handleClick(e)} className='btn btn-sm btn-light' style={{ visibility: "hidden" }} />
                {error && <div className="alert alert-danger" role="alert">
                  {error}
                </div>
                }
              </div>
              <p>Hello, {props.user}</p>
            </>
          }

          <li className="active">
            <Link to={'/'} aria-expanded="false" >Home</Link>

          </li>
          {props.user ?
            <>
              <li>
                <Link to={'/create_blog'}>Write a blog</Link>

              </li>
              <li>
                <Link to={'/my_blogs'}>My Blogs</Link>
              </li>
              <li>
                <Link to={'/feed'}>My Feed</Link>
              </li>
              <li>
                
                <div className="form-check form-switch form-check my-2">
                  <input className="form-check-input" onClick={notification} type="checkbox" id="flexSwitchCheckReverse" disabled={false}/>
                  <label className="form-check-label" htmlFor="flexSwitchCheckReverse">Show notification</label>
                </div>
              </li>

              <li >
                <button className="btn btn-danger my-2" onClick={logout}><i className="fa fa-power-off"></i>  Logout</button>
              </li>
            </>
            :
            <>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
              <li>
                <Link to={"/register"}>Register</Link>
              </li>
            </>
          }

        </ul>


      </nav>

      
    </>
  )
}

export default Sidebar