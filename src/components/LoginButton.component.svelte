<script>
    import { user } from '../stores.js'
    import { auth, googleProvider } from '../firebase';
    import { authState } from 'rxfire/auth';

    const unsubscribe = authState(auth).subscribe(u => user.update(v => v = u));

    function login() {
        auth.signInWithPopup(googleProvider);
    }
</script>

{#if $user}
    <button class="logon-btn" on:click={ () => auth.signOut() }>Signout</button>
{:else}
    <button class="logon-btn" on:click={login}>
        Login
    </button>
{/if}