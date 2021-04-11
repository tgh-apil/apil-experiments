<script>
    import { user } from '../stores.js';
    export let userName;
    export let timestamp;
    export let comment;
</script>

{#if userName == $user.name}
    <div class="poster-comment-bubble">
        <p>{ userName }</p>
        <p>{ comment }</p>
        <p>{ timestamp }</p>
    </div>
{:else}
    <div class="other-comment-bubble">
        <p>{ userName }</p>
        <p>{ comment }</p>
        <p>{ timestamp }</p>
    </div>
{/if}

<style>

.poster-comment-bubble {
    background-color: blue;
}

.other-comment-bubble {
    background-color: red;
}

</style>

