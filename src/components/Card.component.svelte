<script>
    export let picturePath;
    export let altText;
    export let title;
    export let poster;
</script>

<div class="card">
    <div class="card-content">
        <div class="thumbnail-container">
            <img src={picturePath} alt={altText} width="250" height="250">
        </div>
        <div class="title-container">
            <h2>{ title }</h2>
            <div class="poster-container">
                <p>Designed by {poster}</p>
            </div>
        </div>
    </div>
</div>

<style>

    * {
        margin: 0;
        padding: 0;
    }

    .card { 
        width: 250px;
        height: 350px;
        cursor: pointer;
        background: #fff;
        border: 1px solid white;
    }

    .title-container {
        display: grid;
        grid-template-rows: 4fr 1fr;
        gap: 5px;
    }

    .title-container h2 {
        color: #000;
        font-size: 18px;
        font-weight: 500;
        margin-left: 2px;
    }

    .poster-container {
        display: grid;
        grid-template-columns: 1fr 1fr
    }

    .poster-container p {
        color: rgb(172, 172, 172);
        font-size: 12px;
        font-weight: 500;
        grid-column-start: 2;
        justify-self: end;
        margin-right: 2px
    }

</style>