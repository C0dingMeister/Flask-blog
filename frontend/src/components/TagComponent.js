import React from 'react'
import { useNavigate } from 'react-router-dom'

function TagComponent() {
    const navigate = useNavigate()
    const Tags = ['Miscellenious','Art','History','Photography','Educational','Sports','Music','Fashion','Programming']
    const randTags = []
    function randGen(){
        return Math.floor(Math.random()*9)
    }
    let limit = 0
    while(limit < 5){
        let index = randGen()
        
        if(!randTags.includes(Tags[index])){
            randTags.push(Tags[index])
            limit++
        }
        
    }
    const handleClick = (e)=>{
        navigate(`/tag/${e.target.textContent}`)
    }
  return (
    
   randTags ? randTags.map(tag=>{
   return <span onClick={handleClick} className='main-tags' key={Tags.indexOf(tag)}>{tag}</span>
   })
   :
   <>
   <span>No tags yet</span>
   </>
  )
}

export default TagComponent