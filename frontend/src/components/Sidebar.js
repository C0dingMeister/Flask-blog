import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';

function Sidebar(props) {
  const [error, setError] = useState()
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
      localStorage.removeItem("token")
      navigate('/login')
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

              <li >
                <button className="btn btn-danger" onClick={logout}><i className="fa fa-power-off"></i>  Logout</button>
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