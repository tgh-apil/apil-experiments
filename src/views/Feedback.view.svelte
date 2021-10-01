<script>
function backLoad(){
        window.location = '/#/3dviewer/viewer/';
        location.reload();
        backLoad.update(src => src = false);
    }

</script>

<h1 class="center">Suggestions</h1>
<br>
<p class='center'>Please find below the google form for suggestions</p>
<br>

<div class="center">
    <iframe class="center" src="https://docs.google.com/forms/d/e/1FAIpQLSf-dIcZ4a0zlu_usFjR6YrSs95OU7iAffN-jHQYaIJ84ExWgw/viewform?embedded=true" 
width="640" height="1861" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

</div>

<button on:click={backLoad}>Return to Viewer</button>

<style>
    .center{
        text-align: center;
    }
</style>