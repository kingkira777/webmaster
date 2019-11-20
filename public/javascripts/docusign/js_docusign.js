displace = window.displacejs;
window.docu_name = "";
window.isSigned = false;




//Tools============================================================================
$(function () {
    'use strict';

    //Singed Manipulation ======================================================
    
    //-Single Signed
    window.signed_current_docs = function(){
        axios({
            method: 'post',
            url : '/docusign/single-signed',
            data : {
                filename : docu_name
            }
        }).then((rs)=>{
            if(rs.data.message == "signed"){
                swal ( "Singed" ,  "Successfuly Signed" ,  "success");
            }
        });
    };

    //Singed Manipulation ======================================================


    //Save document signed locations-------------------------------------------------
    window.save_document_signedLoc = function () {
        var sign_loc = [];
        var signs = document.getElementById('pdf-content').querySelectorAll('.sign');
        if (signs.length != 0) {
            for (var i = 0; i < signs.length; i++) {
                var left = window.scrollX + signs[i].getBoundingClientRect().left;
                var top = window.scrollY + signs[i].getBoundingClientRect().top;
                var locRec = { 'top': top, 'left': left };
                sign_loc.push(locRec);
            }
            axios({
                method: 'post',
                url: '/docusign/save-sign-loc',
                data: {
                    filename: docu_name,
                    signloc: JSON.stringify(sign_loc)
                }
            }).then(function (response) {
            
                console.log(response.data);
            });
        }
    };


});








//Document Parser==================================================================
$(function () {
    'use strict';
    var urlParams = new URLSearchParams(window.location.search);
    var urlFile = urlParams.get('filepath');
    docu_name = urlParams.get('filename');
    isSigned = (urlParams.get('signed') == "true") ? true : false;

    if (urlFile == null)
        return;

    $('body').addClass('fusion');

    var filepath = urlFile.replace('files/', '');

    console.log(filepath);
 
    var loadingTask = pdfjsLib.getDocument(filepath);
    loadingTask.promise.then(function (pdf) {
        var pdf_container = document.getElementById('pdf-content');
        var pageNumber = pdf.numPages + 1;

        for (var i = 1; i < pageNumber; i++) {

            pdf.getPage(i).then(function (page) {
                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                var div = document.createElement('div');
                div.setAttribute("style", "position: relative");
                pdf_container.appendChild(div);

                var canvas = document.createElement('canvas');
                canvas.setAttribute("style", "border: solid 1px black");
                canvas.setAttribute("id", "signCanvas_" + i);

                div.appendChild(canvas);

                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {

                });
            });
        }
        //Delay The Parser
        setTimeout(function () {
            load_signs();
        }, 300);
    }, function (reason) {
        console.log(reason);
    });

    //Load all Signed
    var load_signs = function () {
        axios({
            method: 'get',
            url: '/docusign/get-signs-loc?filename=' + docu_name,
            responseType: 'json'
        }).then((response) => {
            $('body').removeClass('fusion');
            if(response.data == null)
                return;
            var sign_arr = JSON.parse(response.data.doc_signloc);
            if (response.data.doc_sign == "true") {
                isSigned = true;
                for (var i = 0; i < sign_arr.length; i++) {
                    $('#pdf-content').append('<div  class="sign" style="position:absolute; z-index:111; left:' + sign_arr[i].left + 'px; top:' + sign_arr[i].top + 'px;"> <span class="pull-right closeSing" ><i class="fa fa-times"></i></span><img src="/images/docusign/np-signature/sig_paulfortaleza.png" /></div>');
                }
            } else {
                isSigned = false;
                for (var i = 0; i < sign_arr.length; i++) {
                    $('#pdf-content').append('<div class="sign" style="position:absolute; z-index:111; left:' + sign_arr[i].left + 'px; top:' + sign_arr[i].top + 'px;"> <span class="pull-right closeSing" ><i class="fa fa-times"></i></span> <img  src="/images/docusign/np-signature/sign_here.png" /></div>');
                }
            }
            var sign = document.querySelectorAll('.sign');
            for (var i = 0; i < sign.length; i++) {
                displace(sign[i], {
                    constrain: true,
                    relativeTo: document.querySelector('#pdf-content')
                });
            };
        });
    };

});



//Add Mark Sign =================================================================
$(function () {
    dragSignElement(document.getElementById("markSigned"));
    function removeSignMark() {
        $('.sign span').click(function () {
            $(this).parent().remove();
        });
    }

    function dragSignElement(element) {
        if (element == null)
            return;
        element.onmousedown = function (e) {

            var div = document.createElement('div');
            div.style.position = "absolute";
            div.style.zIndex = "999";
            $(div).addClass('sign');

            var span = document.createElement('span');
            $(span).addClass('pull-right closeSing');

            var icon = document.createElement('i');
            $(icon).addClass('fa fa-times fa-2x');

            var img = document.createElement('img');
            img.src = "/images/docusign/np-signature/sign_here.png";

            span.appendChild(icon);
            div.appendChild(span);
            div.appendChild(img);

            div.style.top = e.pageY - 50 + 'px';
            div.style.left = e.pageX - 100 + 'px';

            $('#pdf-content').append(div);
            onMouseOver(div);
            removeSignMark();
        };

        function onMouseOver(el) {
            el.onmouseup = function (e) {
                el.onmousemove = null;
                displace(el, {
                    constrain: true,
                    relativeTo: document.querySelector('#pdf-content')
                });
            };


            el.onmousemove = function (e) {
                e = e || window.event;
                e.preventDefault();

                el.style.top = e.pageY - 50 + 'px';
                el.style.left = e.pageX - 100 + 'px';
            };
        }
    }
    removeSignMark();
});



//Download Docs Manipulations
$(function () {
    'use strict';


    //Save Copy Signed Docs
    window.save_signed_copy_docs = function () {
        
        $('body').addClass('fusion');

        var signs = document.querySelectorAll('.sign img');
        for (var i = 0; i < signs.length; i++) {
            $(signs[i]).attr("src", "/images/docusign/np-signature/sig_paulfortaleza.png");
        }


        var fd = new FormData();

        var container_height = $('#pdf-content').height();

        var canvas_width = $('canvas').width();
        var canvas_height = $('canvas').height();

        html2canvas($('#pdf-content')[0]).then(function (canvas) {

            var totalPages = Math.ceil(container_height / canvas_height) - 1;

            var imgData = canvas.toDataURL("image/jpeg", 1.5);

            var pdf = new jsPDF('p', 'pt', 'a4');
            var width = pdf.internal.pageSize.width;
            var height = pdf.internal.pageSize.height;
            var pageHeight = height * totalPages;

            pdf.addImage(imgData, 'JPEG', 0, -25, width, pageHeight);

            for (var i = 1; i < totalPages; i++) {
                pdf.addPage('p', 'pt', 'a4');
                pdf.addImage(imgData, 'JPEG', 0, -(height * i), width, pageHeight);
            }

            var blob = pdf.output('blob');
            fd.append('file', blob);
            fd.append('filename', docu_name);

            axios({
                url: '/docusign/save-file-to-server',
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: fd,
            }).then((response) => {
                
                $('body').removeClass('fusion');
                if(response.data == "saved"){
                swal ( "Saved" ,  "Successfuly Saved" , "success");
                }
            });

            var signs = document.querySelectorAll('.sign img');
            for (var i = 0; i < signs.length; i++) {
                $(signs[i]).attr("src", "/images/docusign/np-signature/sign_here.png");
            }
        });
    };

    //DOWNLOA CURRENT DOCUMENT ======================================================
    window.download_current_document = function () {
        var container_height = $('#pdf-content').height();
        var canvas_width = $('canvas').width();
        var canvas_height = $('canvas').height();

        setTimeout(function () {
            html2canvas($('#pdf-content')[0]).then(function (canvas) {

                var totalPages = Math.ceil(container_height / canvas_height) - 1;

                var imgData = canvas.toDataURL("image/jpeg", 1.5);
                var pdf = new jsPDF('p', 'pt', 'a4');
                var width = pdf.internal.pageSize.width;
                var height = pdf.internal.pageSize.height;
                var pageHeight = height * totalPages;

                pdf.addImage(imgData, 'JPEG', 0, -25, width, pageHeight);

                for (var i = 1; i < totalPages; i++) {
                    pdf.addPage('p', 'pt', 'a4');
                    pdf.addImage(imgData, 'JPEG', 0, -(height * i), width, pageHeight);
                }
                //                
                pdf.save(docu_name);
            });
        }, 300);
    };




});