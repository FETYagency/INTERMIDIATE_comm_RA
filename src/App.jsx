import { Fragment, useEffect, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid';

import "./style.css"

// import data from "./data.json"


import Comments from './comments';
import Initiator from './initiator';
import Ask from "./confirmationUI";


let REQ = new Request("https://api.jsonbin.io/v3/b/64e3810fb89b1e2299d40140")
function App() {

    
    let [posts, setPosts] = useState(null)
    let [currUser, setCurrUser] = useState(null)
    
    let [onAsk, setOnAsk] = useState(false)
    let [deleteConfig, setDeleteConfig] = useState(null)


    function handleAddComment(text){
        let newComment = {
            id:uuidv4(),
            content:text,
            createdAt:"now",
            score:0,
            user:currUser
        }
        setPosts([
            ...posts,
            newComment
        ])
    }
    function handleEditComment(text, id){
        let newArr = posts.map(per=>{
            if(per.id===id){
                return{
                    ...per,
                    content:text
                }
            }else{
                return per
            }
        })
        setPosts(newArr)
    }

    function handleAddReply(text,repliesBelong,to){
        let newReply={
            id:uuidv4(),
            content:text,
            createdAt:"now",
            score:0,
            replyingTo:to,
            user:currUser,
        }
        let newArr = posts.map(per=>{
            if(repliesBelong===per.id){
                return{
                    ...per,
                    replies:[
                        ...per.replies,
                        newReply
                    ]
                };
            }else{
                return per;
            }
        })
        setPosts(newArr)
    }
    function handleEditReply(text, repliesBelong, id){
        let newArr = posts.map(per=>{
            if(repliesBelong===per.id){

                let newReplies = per.replies.map(reply=>{
                    if(reply.id===id){
                        return{
                            ...reply,
                            content:text
                        }
                    }else{
                        return reply
                    }
                })

                return{
                    ...per,
                    replies:newReplies
                }
            }else{
                return per
            }
        })
        setPosts(newArr)
    }
    
    function handleAsk(onShow, confiig){
        setOnAsk(onShow)
        setDeleteConfig(confiig)
    }
    function handleDelete(forComment, id, repliesBelong){
        if(forComment){
            let newArr = posts.filter(per=>{
                return per.id!==id
            })
            setPosts(newArr)
        }else{
            let newArr =  posts.map(per=>{
                if(per.id===repliesBelong){
                    let newReplies = per.replies.filter(reply=>{
                        return reply.id!==id
                    })
                    return{
                        ...per,
                        replies:newReplies
                    }
                }else{
                    return per
                }
            })
            setPosts(newArr)
        }
    }
    
    useEffect(()=>{
        let controller = new AbortController()
        let signal = controller.signal

        fetch(REQ, {signal})
        .then(RESP=>{
            if(RESP.ok){
                return RESP.json()
            }else{
                throw(new Error("data fetching problem"))
            }
        })
        .then(DATA=>{
            setPosts(DATA.record.comments)
            setCurrUser(DATA.record.currentUser)
        })
        .catch(ERR=>{
            if(ERR.name==="AbortError"){
                console.log("Request was aborted")
            }else{
                console.error('Error fetching data:', ERR)
            }
        })
        return ()=>{
            controller.abort()
        }
        
    },[])

    return(
        <Fragment>
            {
                posts&&currUser
                ?(
                    <>
                        {onAsk&&<Ask config={deleteConfig} onDelete={handleDelete} handleAsk={handleAsk}/>}
                        <Comments posts={posts} currUser={currUser} onEditedComment={handleEditComment} onAddReply={handleAddReply} onEditedReply={handleEditReply} onAskToDelete={handleAsk}/>
                        <Initiator forComment={true} currUser={currUser} onAddComment={handleAddComment}/>
                    </>
                )
                :(
                    <div className='loading'>
                        <svg
                            className="pl"
                            width={240}
                            height={240}
                            viewBox="0 0 240 240"
                            >
                            <circle
                                className="pl__ring pl__ring--a"
                                cx={120}
                                cy={120}
                                r={105}
                                fill="none"
                                stroke="#000"
                                strokeWidth={20}
                                strokeDasharray="0 660"
                                strokeDashoffset={-330}
                                strokeLinecap="round"
                            />
                            <circle
                                className="pl__ring pl__ring--b"
                                cx={120}
                                cy={120}
                                r={35}
                                fill="none"
                                stroke="#000"
                                strokeWidth={20}
                                strokeDasharray="0 220"
                                strokeDashoffset={-110}
                                strokeLinecap="round"
                            />
                            <circle
                                className="pl__ring pl__ring--c"
                                cx={85}
                                cy={120}
                                r={70}
                                fill="none"
                                stroke="#000"
                                strokeWidth={20}
                                strokeDasharray="0 440"
                                strokeLinecap="round"
                            />
                            <circle
                                className="pl__ring pl__ring--d"
                                cx={155}
                                cy={120}
                                r={70}
                                fill="none"
                                stroke="#000"
                                strokeWidth={20}
                                strokeDasharray="0 440"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                )   
            }
        </Fragment>
    )
    
}
export default App