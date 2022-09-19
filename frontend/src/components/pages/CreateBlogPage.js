import React,{useState,useRef} from "react";
import JoditEditor from 'jodit-react';
import { Container } from "react-bootstrap";
import UserNavBar from "../UserNavBar";
import { useNavigate } from "react-router-dom";

export default function CreateBlogPage({userLoggedIn, setUserLoggedIn}) {
    const editor = useRef(null);
    const navigate = useNavigate()
	const [content, setContent] = useState('');
    const [title, setTitle] = useState();
    const [tag, setTag] = useState();
    const config = {
    readonly: false,
    activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
    toolbarButtonSize: 'middle',
    theme: 'default',
    showCharsCounter:true,
    showWordsCounter:true,
    hidePoweredByJodit:true,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    width: 'auto',
    height: 'auto',
    placeholder:"Write here",
    direction: '',
    language: 'auto',
    debugLanguage: false,
    i18n: 'en',
    tabIndex: -1,
    toolbar: true,
    limitWords:500,
    enter: "P",
    useSplitMode: false,
    
    
    buttons: [
        'bold',
        'strikethrough',
        'underline',
        'italic', '|',
        'ul',
        'ol', '|',
        'outdent', 'indent',  '|',
        'font',
        'fontsize',
        'paragraph', '|',
         '|',
        'align', 'undo', 'redo', '|',
        'hr',
        'fullsize',
    ],
    
    }

    const handleChange = (e) => {
        const {id , value} = e.target;
        if(id === "title"){
            setTitle(value);
        }
        if(id === "tag"){
            setTag(value);
        }
    
    }
	const submit = async (e) => {
        console.log(content,title,tag)
        let data = {
            user: userLoggedIn,
            title: title,
            body: content,
            tag:tag,
        }
        let options = {
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            body: JSON.stringify(data),
        }

        
        const  response = await fetch("http://localhost:5000/api/post",options)
        
        if(response.ok){
            const result = await response.json()
            console.log(result)
        }
        else{
            setUserLoggedIn(undefined)
            navigate("/")
        }
    }
  return (
    <>
    <UserNavBar/>
    <Container>
    <h1 className="display-5" >Share your thoughts!</h1>
    <Container className="createForm" >
    <input type="text" placeholder="Title" id="title" onChange={(e)=>handleChange(e)} className="title-input" />
        <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={5} // tabIndex of textarea
                onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {}}
            />
            <br />
        <input type="text" id="tag" placeholder="Category" maxLength={13} minLength={3} onChange={(e)=>handleChange(e)} className="tag-input" />
        <br />
        
        </Container>
        <button className="btn btn-success createFormBtn" onClick={(e)=>submit(e)}>Submit</button>
    </Container>
       

        
    </>
  );
}
