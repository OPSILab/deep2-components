RC = {};

RC.injectHTML  = function(ln, datasets) {
    $("body").append(
        '<demo-data-sevc-controllet'+
        ' id="controllet"'+
        ' components-url="../../deep-components/"'+
        ' deep-url="../../deep/"'+
        ' datalets-list-url="../../deep/datalets-list"'+
        ' localization="'+ ln + '">'+
        '</demo-data-sevc-controllet>'
    );
};

RC.init = function() {
    $("#controllet").attr("datasets", JSON.stringify(datasets));
    setTimeout(() => {
        $("#options")[0].innerHTML = "";
        $(".tab-content")[0].innerHTML = "LISTA DATASET REGIONE CAMPANIA";//todo ln

        $("button.outside").prop('disabled', true);
    }, 1000);
};