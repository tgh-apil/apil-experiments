<script>
    import { onDestroy, tick } from 'svelte';
    import { user, modelDoc } from '../stores.js'
    import LoginButton from './LoginButton.component.svelte';
    import firebase from 'firebase/app';
    import { db } from '../firebase';

    const modelDocRef = db.collection('models').doc($modelDoc);
    let commentArray = [];
    let comment;

    scrollToBottom();

    const unsubscribe = modelDocRef.onSnapshot((snapshot) => {
        commentArray = snapshot.data().comments;
        commentArray = commentArray;

        // get only 15 of the latest comments
        if (commentArray.length > 15) {
            commentArray = commentArray.slice(commentArray.length - 15, commentArray.length);
        }

        scrollToBottom();
    })

    async function scrollToBottom() {
        await tick();

        let commentContent = document.getElementById("comment-content");
        commentContent.scrollIntoView(false);
    }

    onDestroy(unsubscribe);
    
    async function handleClick() {
        // update the comments field in the collection
        const commentModel = {
            poster: $user.displayName,
            comment: comment,
            timestamp: firebase.firestore.Timestamp.now()
        }

        await modelDocRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(commentModel)
        });

        comment = '';
    }
</script>

<div class="horizontal-wrapper">
    <div id="comment-container" >
        <div id="comment-content">
            {#each commentArray as comment}
                <div class='comment-object'>
                    <p>{comment.poster}</p>
                    <p>{comment.comment}</p>
                    <p>{comment.timestamp.toDate()}</p>
                </div>
            {/each}
        </div>
    </div>
    <div>
        <form>
            <div class="form-container">
                {#if $user}
                    <input bind:value={comment}/>
                    <button on:click|preventDefault={handleClick} type="submit">Send</button>
                {:else}
                    <LoginButton />
                {/if}
            </div>
        </form>
    </div>
</div>

<style>
    .horizontal-wrapper {
        display: grid;
        grid-template-rows: 3fr 1fr;
        grid-gap: 20px;
    }    

    #comment-container {
        height: 18vh;
        overflow: auto;
    }

    .comment-object {
        margin-bottom: 0.5rem;
    }

    .comment-object p {
        font-size: 12px;
    }

    .form-container {
        display: grid;
        grid-template-columns: 3fr 1fr;
        grid-gap: 5px;
    }

    .form-container input {
        height: 100%;
    }

    .form-container input:focus {
        outline: none;
    }

</style>