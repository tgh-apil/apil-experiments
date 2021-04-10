<script>
    import Profile from '../components/Profile.components.svelte';
    import { user } from '../stores.js'
</script>


{#if $user}
    <Profile {...$user} />
{/if}