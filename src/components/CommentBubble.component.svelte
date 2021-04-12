<script>
    import { user } from '../stores.js';
    export let userName;
    export let timestamp;
    export let comment;
</script>

{#if !$user || userName != $user.displayName}
    <div class="other-comment-bubble">
        <div class='comment-bubble-container'>
            <p class="username">{ userName }</p>
            <p class="comment">{ comment }</p>
        </div>
    </div>
    <p class="other-time">{ timestamp }</p>
{:else if userName == $user.displayName}
    <div class="poster-comment-bubble">
        <div class='comment-bubble-container'>
            <p class="username">{ userName }</p>
            <p class="comment">{ comment }</p>
        </div>
    </div>
    <p class="poster-time">{ timestamp }</p>
{/if}

<style>

p {
    color: #fff;
}

.username {
    font-size: 12px;
    padding: 0;
}

.comment {
    font-size: 16px;
}

.poster-time {
    color: rgb(200, 200, 200);
    font-size: 10px;
    padding: 0;
    text-align: left;
}

.other-time {
    color: rgb(200, 200, 200);
    font-size: 10px;
    padding: 0;
    font-size: 10px;
    text-align: right;
    margin-right: 4%;
    padding-bottom: 1rem;
}
.poster-comment-bubble {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    padding-bottom: 0.05rem;
    padding-top: 0.05rem;
    background-color: #0ec2a7;
    border-radius: 2px;
    width: 75%;
}

.other-comment-bubble {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    padding-bottom: 0.05rem;
    padding-top: 0.05rem;
    background-color: rgb(100, 100, 100);
    margin-left: 20%;
    border-radius: 2px;
    width: 75%;
}

</style>

