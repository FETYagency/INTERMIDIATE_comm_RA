import { Fragment, useEffect, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid';

import "./style.css"

import data from "./data.json"

import DeleteIcon from "./delete"
import EditIcon from "./edit"
import MinusIcon from "./minus"
import PlusIcon from "./plus"
import ReplyIcon from "./reply"



function App() {

    const [posts, setPosts] = useState(data.comments);
    const [currUser, setCurrUser] = useState(data.currentUser);

    const [currUserComments, setCurrUserComments] = useState([]);

    const [askTodelete, setAskToDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(undefined)

    const [askTodeleteReply, setAskToDeleteReply] = useState(false)
    const [commentOfReply, setCommentOfReply] = useState(undefined)
    const [deleteIdReply, setDeleteIdReply] = useState(undefined)



    function handleAddPost(newCommm){
        setCurrUserComments([
            ...currUserComments,
            {
                id:uuidv4(), 
                content:newCommm,
                score:0,
                createdAt:"now"
            }
        ])
    }

    function handleChangePost(newContent, id){
        let newArr = currUserComments.map(per=>{
            if(per.id===id){
                return{
                    ...per,
                    content:newContent
                }
            }else{
                return per
            }
        })
        setCurrUserComments(newArr)
    }

    function handleDelete(showUi, idToDelete, yesClicked){
        setAskToDelete(showUi)
        setDeleteId(idToDelete)
        if(yesClicked){
            let newArr = currUserComments.filter(per=>{
                return per.id!==deleteId
            })
            setCurrUserComments(newArr)
        }
    }


    function handleAddReply(text, id, to){
        let newArr = posts.map(per=>{
            if(per.id===id){
                return {
                    ...per,
                    replies:[
                        ...per.replies,
                        {
                            content:text,
                            id:uuidv4(),
                            createdAt:"now",
                            score:0,
                            user: currUser,
                            replyingTo:to
                        }
                    ]
                }
            }else{
                return per
            }
        })
        setPosts(newArr)
    }

    function handleChangeReply(text, replyId, commentName){
        let newArr = posts.map(per=>{
            let newReplies = per.replies.map(reply=>{
                if(reply.id===replyId){
                    return{
                        id:uuidv4(),
                        content:text,
                        score:0,
                        replyingTo:commentName,
                        createdAt:"now",
                        user:currUser
                    }
                }else{
                    return reply
                }
            })
            return{
                ...per,
                replies:[
                    ...newReplies
                ]
            }
        })
        setPosts(newArr)
    }

    function handleDeleteReply(replyId, commentName, showUi, isYesClicked) {
        setAskToDeleteReply(showUi)
        setDeleteIdReply(replyId)
        setCommentOfReply(commentName)
        if(isYesClicked){
            let newArr = posts.map(per=>{
                let newReplies = per.replies.filter(reply=>{
                    return reply.id!==deleteIdReply
                })
                return{
                    ...per,
                    replies:[
                        ...newReplies
                    ]
                }
            })
            setPosts(newArr)
        }
    }

    function handleAddReplyToReply(text, commentName, replyingTo) {
        let newArr = posts.map(per=>{
            if(per.user.username===commentName){
                return {
                    ...per,
                    replies:[
                        ...per.replies,
                        {
                            id:uuidv4(),
                            content:text,
                            replyingTo:replyingTo,
                            score:0,
                            createdAt:"now",
                            user:currUser
                        }
                    ]
                }
            }else{
                return per
            }
        })
        setPosts(newArr)
    }

    return(
        <main>
            {askTodelete &&
            (
                <div className="overlay">
                    <div className="askToDeleteUI">
                        <article>
                            <h2>Delete comment</h2>
                            <p>Are you sure you want to delete this comment? This will remove the comment and can’t be undone.</p>
                        </article>
                        <div className="buttons">
                            <button type="button" className='no' onClick={e=>handleDelete(false, undefined, false)}>NO, CANCEL</button>
                            <button type="button" className='yes' onClick={e=>handleDelete(false, undefined, true)}>YES, DELETE</button>
                        </div>
                    </div>
                </div>
            )
            }
            {askTodeleteReply &&
            (
                <div className="overlay">
                    <div className="askToDeleteUI">
                        <article>
                            <h2>Delete comment</h2>
                            <p>Are you sure you want to delete this comment? This will remove the comment and can’t be undone.</p>
                        </article>
                        <div className="buttons">
                            <button type="button" className='no' onClick={e=>handleDeleteReply(undefined, undefined, false, false)}>NO, CANCEL</button>
                            <button type="button" className='yes' onClick={e=>handleDeleteReply(undefined, undefined, false, true)}>YES, DELETE</button>
                        </div>
                    </div>
                </div>
            )
            }
            {posts&&currUser
            ?(
                <>
                    <AllPosts allPosts={posts} currUser={currUser} onAddReply={handleAddReply} onChangeReply={handleChangeReply} onDeleteReply={handleDeleteReply} onAddReplyToReply={handleAddReplyToReply}/>

                    <CurrUserPosts
                        currUserComments={currUserComments} 
                        currUser={currUser} 
                        onChangePost={handleChangePost} 
                        onDeletePost={handleDelete}
                    />

                    <CurrUserPostsInitiator 
                        currUser={currUser} 
                        onAddPost={handleAddPost}
                    />
                </>
            )
            :(
                <p>loading...</p>
            )
            }
        </main>
    )
    
}

function AllPosts({allPosts, currUser,onAddReply, onChangeReply, onDeleteReply, onAddReplyToReply}) {

    let Post_compo = allPosts.map(per=>{
        return <Post
            key={per.id}
            postDetails={per}
            currUser={currUser}
            onAddReply={onAddReply}
            onChangeReply={onChangeReply}
            onDeleteReply={onDeleteReply}
            onAddReplyToReply={onAddReplyToReply}
        />
            
    })

    return(
        <>
            {Post_compo}
        </>
    )
    
}

    function Post({postDetails, currUser,onAddReply, onChangeReply, onDeleteReply, onAddReplyToReply}) {
        const [showen, setShowen] = useState(false)
        return(
            <div className='post'>
                <div className="comment">
                    <User 
                        isCurrUser={false} 
                        userDetails={postDetails.user} 
                        createdAt={postDetails.createdAt}
                    />
                    <Counter 
                        score={postDetails.score}
                    />

                    <div className="buttons">
                        <button type="button" className='reply' onClick={e=>setShowen(!showen)}><ReplyIcon/>Reply</button>
                    </div>
                    <div className="postContent">
                        <p>{postDetails.content}</p>
                    </div>
                </div>
                {showen&&(
                    <RepliesInitiator
                        currUser={currUser}
                        to={postDetails}
                        onAddReply={onAddReply}
                        onDone={e=>setShowen(e)}
                    />
                )}
                {postDetails.replies.length>0 && <AllReplies replies={postDetails.replies} currUser={currUser} onChangeReply={onChangeReply} onDeleteReply={onDeleteReply} onAddReplyToReply={onAddReplyToReply}/>}
            </div>
        )
    }
    
        function RepliesInitiator({currUser, to, onAddReply, onDone}){
            const [text, setText] = useState("");
            return(
                <div className="replyInitiator">
                    <div className="image"><img src={currUser.image.png}/></div>
                    <textarea placeholder='Add a reply' value={text} onInput={e=>setText(e.target.value)}></textarea>
                    <button type="button" onClick={e=>{
                        onAddReply(text, to.id, to.user.username )
                        setText("")
                        onDone(false)
                    }}>SEND</button>
                </div>
            )
        }

        function AllReplies({replies, currUser, onChangeReply, onDeleteReply ,onAddReplyToReply}){
            let Reply_compo = replies.map(per=>{
                if(per.user.username===currUser.username){
                    return <CurrUserReply key={per.id} replyDetails={per} currUser={currUser} onChangeReply={onChangeReply} onDeleteReply={onDeleteReply}/>
                }else{
                    return <Reply key={per.id} replyDetails={per} currUser={currUser} onAddReplyToReply={onAddReplyToReply}/>
                }
            })
            return(
                <div className="replies">
                    {Reply_compo}
                </div>
            )
        }

        function Reply({replyDetails,currUser, onAddReplyToReply}){
            const [onShow, setOnShow] = useState(false)
            return(
                <div className='replyPost'>
                    <div className="reply">
                        <User isCurrUser={false} userDetails={replyDetails.user} createdAt={replyDetails.createdAt}/>
                        <Counter score={replyDetails.score}/>
                        <div className="buttons">
                            <button type="button" className="reply" onClick={e=>setOnShow(!onShow)}><ReplyIcon/> Reply</button>
                        </div>
                        <div className="postContent">
                            <p><span>{"@"+replyDetails.replyingTo}</span> {replyDetails.content}</p>
                        </div>
                    </div>
                    {onShow&&<RepliesOfReplyInitiator currUser={currUser} to={replyDetails} onDone={e=>setOnShow(e)} onAddReply={onAddReplyToReply}/>}
                    
                </div>
            )
        }

                                    function RepliesOfReplyInitiator({currUser, to, onAddReply, onDone}){
                                        const [text, setText] = useState("");
                                        return(
                                            <div className="replyInitiator">
                                                <div className="image"><img src={currUser.image.png}/></div>
                                                <textarea placeholder='Add a reply' value={text} onInput={e=>setText(e.target.value)}></textarea>
                                                <button type="button" onClick={e=>{
                                                    onAddReply(text, to.replyingTo, to.user.username)
                                                    setText("")
                                                    onDone(false)
                                                }}>SEND</button>
                                            </div>
                                        )
                                    }

        function CurrUserReply({replyDetails, currUser, onChangeReply, onDeleteReply}){
            const [onEdit, setOnEdit] = useState(false);
            const [text, setText] = useState(replyDetails.content)
            return(
                <div className='reply currUser'>
                    <User isCurrUser={true} userDetails={currUser} createdAt={replyDetails.createdAt}/>
                    <Counter score={replyDetails.score} isCurrUser={true}/>
                    <div className="buttons">
                        <button type="button" className='delete-btn' onClick={e=>onDeleteReply(replyDetails.id ,replyDetails.replyingTo, true)}><DeleteIcon/> Delete</button>
                        <button type="button" className="edit-btn" onClick={e=>setOnEdit(!onEdit)}><EditIcon/> Edite</button>
                    </div>
                    {onEdit
                    ?(
                        <div className='updater'>
                            <textarea value={text} onInput={e=>{
                                setText(e.target.value)
                            }}></textarea>
                            <button type="button" onClick={e=>{
                                onChangeReply(text ,replyDetails.id ,replyDetails.replyingTo)
                                setOnEdit(false)
                            }}>UPDATE</button>
                        </div>
                    )
                    :(
                        <div className="postContent">
                            <p><span>{"@"+replyDetails.replyingTo}</span> {replyDetails.content}</p>
                        </div>
                    )
                    }
                </div>
            )
        }


        

function CurrUserPosts({currUserComments, currUser, onChangePost, onDeletePost}){
    let CurrUserPost_compo = currUserComments.map(per=>{
        return <CurrUserPost 
            key={per.id} 
            postDetails={per} 
            currUser={currUser} 
            onChange={onChangePost} 
            onDelete={onDeletePost}
        />
    })
    return(
        <>
            {CurrUserPost_compo}
        </>
    )
}

    function CurrUserPost({postDetails, currUser, onChange, onDelete}) {
        const [editShowen, setEditShowen] = useState(false)
        const [editedText, setEditedTextes] = useState(postDetails.content)
        return(
            <div className='currUserPost'>
                 <User userDetails={currUser} createdAt={postDetails.createdAt} isCurrUser={true}/>
                 <Counter score={postDetails.score} isCurrUser={true}/>
                 <div className="buttons">
                    <button className='delete-btn' onClick={e=>{
                        onDelete(true, postDetails.id)
                        setEditShowen(false)
                    }}><DeleteIcon/> Delete</button>
                    <button className='edit-btn' onClick={e=>{
                        setEditShowen(!editShowen)
                    }}><EditIcon/> Edit</button>
                 </div>
                 {editShowen
                 ?(
                    <div className='updater'>
                        <textarea value={editedText} onInput={e=>setEditedTextes(e.target.value)}></textarea>
                        <button type="button" onClick={e=>{
                            onChange(editedText, postDetails.id)
                            setEditShowen(!editShowen)
                        }}>UPDATE</button>
                    </div>
                 )
                 :(
                    <div className="postContent">
                        <p>{postDetails.content}</p>
                    </div>
                 )}
            </div>
        )
    }
        function User({userDetails, createdAt, isCurrUser}){
            return(
                <div className="userDetails">
                    <div className="userImage">
                        <img src={userDetails.image.png}/>
                    </div>
                    <h3 className='userName'>{userDetails.username}</h3>
                    {isCurrUser&&<span className="label">YOU</span>}
                    <p className='createdAt'>{createdAt}</p>
                </div>
            )
        }
        function Counter({score, isCurrUser=false}) {
            const [postScore, setPostScore] = useState(score)
            const [vote, setVote] = useState("any")
            return(
                <div className="scoreCounter">
                    <span className='plus_btn' onClick={e=>{
                               if(!isCurrUser&&(vote==="plus"||vote==="any")){
                                setPostScore(score+1)
                                setVote("minus")
                            }
                    }}>
                        <PlusIcon/>
                    </span>
                    <div className="boldScore">{postScore}</div>
                    <span className='minus_btn' onClick={e=>{
                        if(!isCurrUser&&(vote==="minus"||vote==="any")){
                            setPostScore(score-1)
                            setVote("plus")
                        }
                    }}>
                        <MinusIcon/>
                    </span>
                </div>
            )
        }


function CurrUserPostsInitiator({onAddPost, currUser}){
    const [text, setText] = useState("")
    return(
        <div className="postInitiator">
            <div className="image"><img src={currUser.image.png}/></div>
            <textarea value={text} onInput={e=>setText(e.target.value)} placeholder='Add a comment  '></textarea>
            <button type="button" onClick={e=>{
                onAddPost(text)
                setText("")
            }}>SEND</button>
        </div>
    )
}

export default App
