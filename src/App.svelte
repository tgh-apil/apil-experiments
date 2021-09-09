<script>
    import { hasPopup } from './stores';
    import Router from 'svelte-spa-router';
    // components
    import Navbar from './components/Navbar.component.svelte';
    // views
    import Profile from './views/Profile.view.svelte';
    import Experiments from './views/Experiments.view.svelte';
    import ModelViewer from './views/ModelViewer.views.svelte';
    import ModelViewerEperiment from './views/ModelViewerExperiment.view.svelte';
    import NotFound from './views/NotFound.view.svelte';
    import FileUpload from './views/File.view.svelte';
    
    hasPopup.update(src => src = false);
</script>

{#if $hasPopup === false}
    <Navbar />
{/if}

<Router routes={
    {
        '/': Experiments,
        '/profile': Profile,
        '/3dviewer': ModelViewerEperiment,
        '/3dviewer/viewer': ModelViewer,
        '/fileUpload/': FileUpload,
        '*': NotFound
    }
} />