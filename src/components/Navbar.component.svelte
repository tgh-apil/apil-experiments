<script>
    import LoginButton from './LoginButton.component.svelte';
    import { user } from '../stores.js'
</script>

<nav class="nav-container">
    <div class="nav-links">
        <a href='/#/'>Experiments</a>
        <a href='https://github.com/tgh-apil'>Github</a>
        <a href='https://apil.ca/'>apil.ca</a>
        {#if $user}
            <a href="/#/fileUpload">File Upload</a>
        {/if}
    </div>
    <div class="nav-profile">
        {#if $user}
            <a href='/#/profile'>
                <img src={ $user.photoURL } alt="user avatar">
            </a>
        {/if}
        <div class="login-button-container">
            <LoginButton />
        </div>
    </div>
</nav>

<style>
    .nav-container {
        display: grid;
        grid-template-columns: 3fr 1fr;
        height: 50px;
    }

    .nav-container img {
        height: 35px;
        width: auto;
        border-radius: 50%;
        margin-top: 5px;
        border: 5px solid transparent;
        transition: all;
        transition-duration: 75ms;
    }

    .nav-container img:hover {
        border: 5px solid #0ec2a7;
    }

    .nav-links {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 0.5fr;
        justify-items: center;
        align-items: center;
        grid-gap: 10px;
    }

    .nav-links a {
        font-family: 'IBM Plex Mono', monospace;
    }

    .nav-links a:hover {
        border-bottom: solid 10px #0ec2a7;
    }

    .nav-profile {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-self: end;
        justify-items: center;
        align-items: center;        
    }

    .login-button-container {
        grid-column-start: 2;
    }
</style>