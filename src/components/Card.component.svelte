<script>
    export let picturePath;
    export let altText;
    export let title;
</script>

<div class="card">
    <div class="card-content">
        <div class="thumbnail-container">
            <img src={picturePath} alt={altText} width="250" height="250">
        </div>
        <div class="title-container">
            <h3>{ title }</h3>
        </div>
    </div>
</div>

<style>

    .card { 
        width: 250px;
        height: 350px;
        position: relative;
        cursor: pointer;
    }

    .title-container {
        background-color: #fff;
        position: absolute;
        left: 5px;
        bottom: 0;
    }

    .title-container h3 {
        color: #fff;
        font-size: 14px;
    }

    .thumbnail-container {
        position: relative;
        z-index: -1;
    }

</style>