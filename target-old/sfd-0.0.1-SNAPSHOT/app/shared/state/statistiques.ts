import { ChangeDetectorRef,Injectable } from '@angular/core';
declare const jQuery: any;
declare const jsPDF: any;
declare const html2canvas: any;
declare const html2pdf: any;

@Injectable()
export class StateService {
  heightLeft: number;
  canvas: any;
  imgHeight: number;
  a4 = [595.28, 841.89]; // for a4 size paper width and height
  imgWidth: number = 200;
  pageHeight: number = 290;
  position: number = 5;

  constructor() {}
  __exec(printArea){
    var myWindow = window.open('', '', 'width=800, height=800');
    myWindow.document.write('<link rel="stylesheet" type="text/css" href="state.css"/>');
    var table = document.getElementById(printArea).innerHTML;
    myWindow.document.write(table);
    setTimeout(function(){myWindow.print(),myWindow.close()},1000)
   

    // if(myWindow.document.readyState === 'complete') {
    //   // good to go!
    //   setTimeout(function(){myWindow.print(),myWindow.close()},1000);
    // }else{
    //  
    // }

  }

  printAsPdf(printArea){

          this.canvas =document.querySelectorAll('canvas');

          if (this.canvas.length > 0) {

             var i;
             for (i = 0; i < this.canvas.length; i++) {

                (()=>{
                  var imageElement= this.canvas[i].parentNode;
                  var myImage = this.canvas[i].toDataURL("image/png");
                  var image = new Image();
                  image.src = myImage;

                  // image.onload = () => {
                   imageElement.innerHTML="";
                   imageElement.appendChild(image);
                   if(i+1 == this.canvas.length){
                     this.__exec(printArea);
                   }
                  // }
               })();
             }
          }else{
            this.__exec(printArea);
          }
  }



  __printDiv(printArea, stylefile?) {
      window.frames["print_frame"].load=function(){
          window.frames["print_frame"].print();
      }
      window.frames["print_frame"].document.write('<link rel="stylesheet" type="text/css" href="state.css"/>');
      if (stylefile){
        window.frames["print_frame"].document.write('<link rel="stylesheet" type="text/css" href="landscape.css"/>');
      }
      let table=printArea;
      window.frames["print_frame"].document.write(table)
      window.frames["print_frame"].focus();
  }



  printAsPdf2(printArea,printCanvas?,stylefile?){

          // this.canvas =printArea.querySelectorAll('canvas');

          if (printCanvas.length > 0) {

             var i;
             for (i = 0; i < printCanvas.length; i++) {

                (()=>{
                  var imageElement= printCanvas[i].parentNode;
                  var myImage = printCanvas[i].toDataURL("image/png");
                  var image = new Image();
                  image.src = myImage;

                  // image.onload = () => {
                   imageElement.innerHTML="";
                   imageElement.appendChild(image);
                   if(i+1 == printCanvas.length){
                     this.__printDiv(printArea,stylefile);

                   }
                  // }
               })();
             }
          }else{
            this.__printDiv(printArea, stylefile);
          }
  }

  htmlToPdf(selector: string, fileName: string){
    var pdf = new jsPDF('p', 'pt', 'a4');
	  pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;
    let html = jQuery(selector);
	  html2pdf(html, pdf, function(pdf){
        var iframe = document.createElement('iframe');
        iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:100%');
        document.body.appendChild(iframe);
        iframe.src = pdf.output('datauristring');
	  });
  }
  save(selector: string, fileName: string) {
    let html = jQuery(selector);
    jQuery("body").scrollTop(0);
    this.position = 5;
    this.createPDF(fileName, html);
  }
  private createPDF(fileName: string, html: any) {
    this.getCanvas(html).then(canvas => {
      this.canvas = canvas;
      this.imgHeight = this.canvas.height * this.imgWidth / this.canvas.width;
      this.heightLeft = this.imgHeight;
      let img = this.canvas.toDataURL("image/png"),
        doc = new jsPDF({
          unit: "mm",
          format: "a4"
        });
      doc.addImage(img, "PNG", 5, this.position, this.imgWidth, this.imgHeight);
      this.heightLeft -= this.pageHeight;

      while (this.heightLeft >= 0) {
        this.position = this.heightLeft - this.imgHeight + 5;
        doc.addPage();
        doc.addImage(
          img,
          "PNG",
          5,
          this.position,
          this.imgWidth,
          this.imgHeight
        );
        this.heightLeft -= this.pageHeight;
      }

      // doc.autoPrint();
      doc.save(`${fileName}.pdf`);
    });
  }

  // create canvas object
  private getCanvas(html: any) {
    let doc = html;
    //doc.width((this.a4[0] * 1.33333) - 50).css('max-width', 'none');
    return html2canvas(doc, {
      imageTimeout: 2000,
      height: html.height()
    });
  }
}
