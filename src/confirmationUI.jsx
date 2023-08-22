export default function Ask({onDelete,config,handleAsk}) {
    return(
        <div className="overlay">
            <div className="askToDeleteUI">
                <article>
                    <h2>Delete comment</h2>
                    <p>Are you sure you want to delete this comment? This will remove the comment and can’t be undone.</p>
                </article>
                <div className="buttons">
                    <button type="button" className='no' onClick={e=>handleAsk(false, null)}>NO, CANCEL</button>
                    <button type="button" className='yes' onClick={e=>{
                        onDelete(config.forComm,config.id, config.repliesBelong)
                        handleAsk(false, null)
                    }}>YES, DELETE</button>
                </div>
            </div>
        </div>  
    )
}