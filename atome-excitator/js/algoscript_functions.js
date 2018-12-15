var client,taskTable,DropboxSync=false;var dircontent=[];var openeddir=0;function getAccessTokenFromUrl(){return utils.parseQueryString(window.location.hash).access_token;}
  function isAuthenticated(){return!!getAccessTokenFromUrl();}
  function renderItems(items){items.forEach(function(item){Ecrire(item.name);});}
  (function(window){window.utils={parseQueryString:function(str){var ret=Object.create(null);if(typeof str!=='string'){return ret;}
  str=str.trim().replace(/^(\?|#|&)/,'');if(!str){return ret;}
  str.split('&').forEach(function(param){var parts=param.replace(/\+/g,' ').split('=');var key=parts.shift();var val=parts.length>0?parts.join('='):undefined;key=decodeURIComponent(key);val=val===undefined?null:decodeURIComponent(val);if(ret[key]===undefined){ret[key]=val;}else if(Array.isArray(ret[key])){ret[key].push(val);}else{ret[key]=[ret[key],val];}});return ret;}};})(window);var client;function InitDropbox(){var CLIENT_ID=DropboxAppID;if(isAuthenticated()){client=new Dropbox({accessToken:getAccessTokenFromUrl()});client.writeFile=function(filename,filecontents,x,y){client.filesUpload({path:'/'+filename,contents:filecontents,mode:'overwrite'});};client.readFile=function(filename,b,c){client.filesDownload({path:'/'+filename}).then(function(data){var reader=new FileReader();reader.onload=function(){c(null,reader.result);};reader.readAsText(data.fileBlob.slice());});};client.remove=function(filename,f){client.filesDelete({path:'/'+filename});};client.readdir=function(filename,b,f){client.filesListFolder({path:'/'+filename}).then(function(x){f(null,x.entries);});};DropboxSync=true;dircontent=[];openeddir=0;ReadCompleteDir('');waitUntilOk(function(){SynchronizeWithDropbox(dircontent);});}else{client=new Dropbox({clientId:CLIENT_ID});var authUrl=client.getAuthenticationUrl(window.location);window.location=authUrl;}}
  function importDropbox_file_to_InternalFS(filenameDB,filenameIFS){var xhr=client.readFile(filenameDB,null,function(error,fs){window.localStorage[filenameIFS]=fs;});}
  function lsDropboxFile(){client.readdir('',{},function(error,filesystem){if(error){return null;}
  AfficherTableau(filesystem);});}
  function exportAllFStoDropboxFS(){for(p in window.localStorage){if(SousChaine(p,0,Longueur('dropbox-auth'))!='dropbox-auth')
  var xhr=client.writeFile(p,window.localStorage[p],null,function(error){});}}
  function readDropboxFile(myfilename){var fichier=taskTable.query({filename:myfilename});if(Taille(fichier)>0)
  return(fichier[0].get('filecontents'));else return'ERRORNOFILE';}
  function writeDropboxFile(myfilename,myfilecontents){var xhr=client.writeFile(myfilename,myfilecontents,null,function(error){});}
  function removeDropboxFile(myfilename){try{var xhr=client.remove(myfilename,function(error){});}catch(e){alert('ERROR '+e);}}
  function lsDropbox(){var fichier=taskTable.query({});for(var i=0;i<Taille(fichier);i++){if(fichier[i].has('filename'))Ecrire(fichier[i].get('filename'));}}
  function exportLibraryToDropbox(){for(p in window.localStorage){if(SousChaine(p,0,Longueur('dropbox-auth'))!='dropbox-auth')
  writeDropboxFile(p,readFile(p));}}
  function ReadCompleteDir(root){openeddir++;client.filesListFolder({path:root}).then(function(response){filesystem=response.entries;for(var p in filesystem){if(filesystem[p][".tag"]=='folder'){ReadCompleteDir(((root!='')?(root+'/'):'/')+filesystem[p].name);}else{dircontent.push(((root!='')?(root+'/'):'/')+filesystem[p].name);}}
  openeddir--;});}
  function waitUntilOk(f){if(openeddir>0){setTimeout(function(){waitUntilOk(f);},10);}else f();}
  function ReadFromDropbox(filename,callback){client.filesDownload({path:'/'+filename}).then(function(data){var reader=new FileReader();reader.onload=function(){callback(filename,reader.result);};reader.readAsText(data.fileBlob.slice());});}
  function SynchronizeWithDropbox(content){for(var i=0;i<Taille(content);i++){if(content[i][0]=='/')content[i]=content[i].substring(1);if(content[i].substring(0,Longueur('__Conflicts/'))!='__Conflicts/'){if(window.localStorage[content[i]]==undefined){ReadFromDropbox(content[i],function(n,d){window.localStorage[n]=d;});}else{ReadFromDropbox(content[i],function(n,d){if(d!=window.localStorage[n]){window.localStorage['__Conflicts/'+n]=window.localStorage[n];window.localStorage[n]=d;}});}}}
  for(var p in window.localStorage){if(typeof(window.localStorage[p])=='string'&&(p.substring(0,Longueur('__Conflicts/'))!='__Conflicts/')&&(p.substring(0,Longueur('dropbox-auth:'))!='dropbox-auth:'))
  if(dircontent.indexOf(p)<0)writeDropboxFile(p,window.localStorage[p]);}}
  var builtin_ImagesToBePreloaded=0;function PreloadImage(imageurl){var img=new Image();img.src=imageurl.replace(/^[\s\n]+/g,'').replace(/[\s\n]+$/g,'').replace(/\n/g,'');builtin_ImagesToBePreloaded++;img.onload=function(){builtin_ImagesToBePreloaded--;};return img;}
  function WaitPreload(f){if(builtin_ImagesToBePreloaded>0){setTimeout(function(){WaitPreload(f);},10);}else{f();}}
  function DrawImageObject(image,x,y,l,h){ctx.drawImage(image,ViewX(x),ViewY(y),ViewX(l),ViewY(h))}
  function PreloadGooglefont(familyname){var name='Sedgwick Ave Display',typeOfFont='cursive';var t=familyname.split(',');name=t[0];typeOfFont=t[1].replace(' ','');name=name.replace(/\'/g,"");name=name.replace(/\"/g,"");var fname=name.replace(' ','+');var link=document.createElement('link');link.rel='stylesheet';link.type='text/css';link.href='http://fonts.googleapis.com/css?family='+fname;document.getElementsByTagName('head')[0].appendChild(link);return'"'+name+'" ,'+typeOfFont;}
  function includeURL(url){var xhttp=new XMLHttpRequest();xhttp.onreadystatechange=function(){var lignes=this.responseText;try{window.eval(lignes);}catch(e){};};xhttp.open("GET",url,true);xhttp.send();}
  var builtin_PreloadedLibs=0;function PreloadLib(url){var xhttp=new XMLHttpRequest();xhttp.onload=function(e){builtin_PreloadedLibs--;var lignes=this.responseText;try{window.eval(lignes);}catch(e){};};xhttp.open("GET",url,true);builtin_PreloadedLibs++;xhttp.send();}
  function WaitPreloadLibs(f){if(builtin_PreloadedLibs>0){setTimeout(function(){WaitPreloadLibs(f);},10);}else{f();}}
  builtin_oldfilename='';function builtincapturetouch(e){e.preventDefault();var decy=GEBID('mycanvas').style.top.replace('px','');var y=(e.changedTouches[0].clientY-decy)*Math.abs(maxviewport_y-minviewport_y)/size_canvas_y;if(viewport_dir==1){y+=minviewport_y;}else{y=maxviewport_y-y;}
  if(builtinclick)MouseClick(minviewport_x+e.changedTouches[0].clientX*Math.abs(maxviewport_x-minviewport_x)/size_canvas_x,y);}
  var builtinclick=false;function builtinMouseDown(e){e.preventDefault();builtinclick=true;var decy=GEBID('mycanvas').style.top.replace('px','');if(typeof(e.changedTouches)!='undefined')builtincapturemouse({layerX:e.changedTouches[0].clientX,layerY:(e.changedTouches[0].clientY-decy)});else builtincapturemouse(e);}
  function builtinMouseUp(e){e.preventDefault();builtinclick=false;}
  function builtinMouseMoveEvent(e){e.preventDefault();var y=e.layerY*Math.abs(maxviewport_y-minviewport_y)/size_canvas_y;if(viewport_dir==1){y+=minviewport_y;}else{y=maxviewport_y-y;}
  if(builtinclick)MouseMove(minviewport_x+e.layerX*Math.abs(maxviewport_x-minviewport_x)/size_canvas_x,y);}
  function builtincapturemouse(e){var y=e.layerY*Math.abs(maxviewport_y-minviewport_y)/size_canvas_y;if(viewport_dir==1){y+=minviewport_y;}else{y=maxviewport_y-y;}
  MouseClick(minviewport_x+e.layerX*Math.abs(maxviewport_x-minviewport_x)/size_canvas_x,y);}
  function builtincapturekey(e){var res='';for(p in e)res+=p+'='+e[p]+'\n';alert(res);}
  function Keypressed(t){}
  function MouseClick(x,y){}
  function MouseMove(x,y){}
  function plot(f,deb,fin){var nbpoints=100;var T=[];for(var i=0;i<=100;i++){var x=deb+(fin-deb)/nbpoints*i;T[i]=[x,f(x)];}
  AfficherCourbe(T,false,false,'red','-',1);}
  var FastBase64={chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encLookup:[],Init:function(){for(var i=0;i<4096;i++){this.encLookup[i]=this.chars[i>>6]+this.chars[i&0x3F];}},Encode:function(src){var len=src.length;var dst='';var i=0;while(len>2){n=(src[i]<<16)|(src[i+1]<<8)|src[i+2];dst+=this.encLookup[n>>12]+this.encLookup[n&0xFFF];len-=3;i+=3;}
  if(len>0){var n1=(src[i]&0xFC)>>2;var n2=(src[i]&0x03)<<4;if(len>1)n2|=(src[++i]&0xF0)>>4;dst+=this.chars[n1];dst+=this.chars[n2];if(len==2){var n3=(src[i++]&0x0F)<<2;n3|=(src[i]&0xC0)>>6;dst+=this.chars[n3];}
  if(len==1)dst+='=';dst+='=';}
  return dst;}}
  FastBase64.Init();var RIFFWAVE=function(data){this.data=[];this.wav=[];this.dataURI='';this.header={chunkId:[0x52,0x49,0x46,0x46],chunkSize:0,format:[0x57,0x41,0x56,0x45],subChunk1Id:[0x66,0x6d,0x74,0x20],subChunk1Size:16,audioFormat:1,numChannels:1,sampleRate:8000,byteRate:0,blockAlign:0,bitsPerSample:8,subChunk2Id:[0x64,0x61,0x74,0x61],subChunk2Size:0};function u32ToArray(i){return[i&0xFF,(i>>8)&0xFF,(i>>16)&0xFF,(i>>24)&0xFF];}
  function u16ToArray(i){return[i&0xFF,(i>>8)&0xFF];}
  this.Make=function(data){if(data instanceof Array)this.data=data;this.header.byteRate=(this.header.sampleRate*this.header.numChannels*this.header.bitsPerSample)>>3;this.header.blockAlign=(this.header.numChannels*this.header.bitsPerSample)>>3;this.header.subChunk2Size=this.data.length;this.header.chunkSize=36+this.header.subChunk2Size;this.wav=this.header.chunkId.concat(u32ToArray(this.header.chunkSize),this.header.format,this.header.subChunk1Id,u32ToArray(this.header.subChunk1Size),u16ToArray(this.header.audioFormat),u16ToArray(this.header.numChannels),u32ToArray(this.header.sampleRate),u32ToArray(this.header.byteRate),u16ToArray(this.header.blockAlign),u16ToArray(this.header.bitsPerSample),this.header.subChunk2Id,u32ToArray(this.header.subChunk2Size),this.data);this.dataURI='data:audio/wav;base64,'+FastBase64.Encode(this.wav);};if(data instanceof Array)this.Make(data);};function ChargerSon(url){var res=document.createElement('audio');res.setAttribute('src',url);res.load();return res;}
  function CreerSon(data,samplerate){var wave=new RIFFWAVE();wave.header.sampleRate=samplerate;wave.header.numChannels=1;wave.Make(data);var res=document.createElement('audio');res.setAttribute('src',wave.dataURI);res.load();return res;}
  function encode64(input){var keyStr="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/"+"=";input=escape(input);var output="";var chr1,chr2,chr3="";var enc1,enc2,enc3,enc4="";var i=0;do{chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64;}else if(isNaN(chr3)){enc4=64;}
  output=output+keyStr.charAt(enc1)+keyStr.charAt(enc2)+keyStr.charAt(enc3)+keyStr.charAt(enc4);chr1=chr2=chr3="";enc1=enc2=enc3=enc4="";}while(i<input.length);return output;}
  function decode64(input){var keyStr="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/"+"=";var output="";var chr1,chr2,chr3="";var enc1,enc2,enc3,enc4="";var i=0;var base64test=/[^A-Za-z0-9\+\/\=]/g;if(base64test.exec(input)){alert("There were invalid base64 characters in the input text.\n"+"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"+"Expect errors in decoding.");}
  input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}
  if(enc4!=64){output=output+String.fromCharCode(chr3);}
  chr1=chr2=chr3="";enc1=enc2=enc3=enc4="";}while(i<input.length);return unescape(output);}
  function ImportSon(nomfichier){var sonurl=readFile(nomfichier).replace(/^[\s\n]+/g,'').replace(/[\s\n]+$/g,'');var sondata=decode64(SousChaine(sonurl,PositionDans(sonurl,'base64')+7),Longueur(sonurl));var numchannels=Caractere_vers_Ascii(sondata[22])+Caractere_vers_Ascii(sondata[23])*256;var samplerate=Caractere_vers_Ascii(sondata[24])+Caractere_vers_Ascii(sondata[25])*256+256*256*Caractere_vers_Ascii(sondata[26])+Caractere_vers_Ascii(sondata[27])*256*256*256;var bitssample=Caractere_vers_Ascii(sondata[34])+Caractere_vers_Ascii(sondata[35])*256;var decalage=Math.floor(bitssample/8);var data=Tableau();var k=0;for(var i=0;i<Longueur(sondata)-44;i+=decalage){data[k]=0;puiss=1;for(var j=0;j<decalage&&(44+i+j<Longueur(sondata));j++){data[k]+=(Caractere_vers_Ascii(CaractereEn(sondata,44+i+j,1)))*puiss;puiss*=256;}
  k++;}
  var maxval=Math.pow(2,bitssample);if(bitssample>8){for(var i=0;i<Taille(data);i+=1){if(data[i]>maxval/2)data[i]=data[i]-maxval;data[i]=Math.floor(0.5*256*(data[i])/maxval+127);}}
  return data;}
  function SampleRate(nomfichier){var sonurl=readFile(nomfichier).replace(/^[\s\n]+/g,'').replace(/[\s\n]+$/g,'');var sondata=decode64(SousChaine(sonurl,PositionDans(sonurl,'base64')+7),Longueur(sonurl));var samplerate=Caractere_vers_Ascii(sondata[24])+Caractere_vers_Ascii(sondata[25])*256+256*256*Caractere_vers_Ascii(sondata[26])+Caractere_vers_Ascii(sondata[27])*256*256*256;return samplerate;}
  function SauverSon(nomfichier,data,samplerate){var wave=new RIFFWAVE();wave.header.sampleRate=samplerate;wave.header.numChannels=1;wave.Make(data);writeFile(nomfichier,wave.dataURI);}
  function ExportSon(data,samplerate){var wave=new RIFFWAVE();wave.header.sampleRate=samplerate;wave.header.numChannels=1;wave.Make(data);window.open(wave.dataURI);}
  function writeFile(filename,content){window.localStorage[filename]=content;if(DropboxSync)writeDropboxFile(filename,content)}
  function EcrireDans(filename,content){window.localStorage[filename]+=content;}
  function includeFile(filename){try{window.eval(readFile(filename));}catch(e){};}
  function readAllFS(str){var tab=str.split('\n');str='';var flag=false;for(var i=0;i<Taille(tab);i++){tab[i]=tab[i].replace(new RegExp('^[\-]{3,100}','g'),'-=-=-=-=-');if(flag)str+='\n';flag=true;str+=tab[i];}
  var tab=str.split('-=-=-=-=-');for(var i=0;i<Taille(tab)-1;i+=2){writeFile(tab[i].replace(/\n/g,''),tab[i+1].replace(/\n/,''));}}
  function ls(){for(var p in window.localStorage)if(SousChaine(p,0,Longueur('dropbox-auth'))!='dropbox-auth'&&typeof(window.localStorage[p])=='string')Ecrire(p);}
  function directory(){var res='';for(var p in window.localStorage)if(SousChaine(p,0,Longueur('dropbox-auth'))!='dropbox-auth'&&p.indexOf('togetherjs.')<0&&typeof(window.localStorage[p])=='string')res+=p+'\n';return res;}
  function readFile(filename){return window.localStorage[filename];}
  function removeFile(filename){delete window.localStorage[filename];if(DropboxSync)removeDropboxFile(filename)}
  function clearAllFS(){for(var p in window.localStorage)removeFile(p);}
  function FileExists(filename){return(window.localStorage[filename])?true:false;}
  function renameFile(oldname,newname){writeFile(newname,readFile(oldname));removeFile(oldname);}
  function removeAllFiles(){for(var p in window.localStorage)removeFile(p);}
  var Exemples_javascripts_nom=Array();var Exemples_javascripts_inst=Array();var Exemples_javascripts_fonctions=Array();Exemples_javascripts_nom[0]="Exemple d'utilisation d'AfficherCourbe";Exemples_javascripts_inst[0]="var tab=new Array(1,3,5,2,4);\nvar tab2=new Array(16,2,1,3,4);\n// Obtenir de l'aide sur AfficherCourbe\nAfficherCourbe();\nAfficherCourbe(tab2);\nAfficherCourbe(tab,true,false,'green','X',1);\n";Exemples_javascripts_fonctions[0]="";function texte_a_etudier(){return GEBID("MonTexte").value;}
  function getEntreetexte(){return GEBID("MonTexte").value;}
  function setEntreetexte(valeur){GEBID("MonTexte").value=valeur;}
  function AfficherTableau(tab){for(var i=0;i<tab.length;i++){if(typeof(tab[i])!="object")Ecrire(tab[i]);else{ligne="";for(var p in tab[i])
  ligne=ligne+tab[i][p]+"\t";Ecrire(ligne);}}}
  function affiche_tableau(tab){AfficherTableau(tab);}
  function point(x1,y1){var tab=new Array(x1,y1);return(tab);}
  Exemples_javascripts_nom[1]="Animation";Exemples_javascripts_inst[1]="Initialiser();\nAfficheGraphique();Anim(0);";Exemples_javascripts_fonctions[1]="function Anim(t) {\n  if (t<600) {\n    Effacer();\n    for(i=1; i<480; i++) {\n      Point(i,150+50*Math.cos((i+t)*3.14/180),'red');\n    }\n   setTimeout('Anim('+(t+1)+')',1);\n  }\n}";Exemples_javascripts_nom[2]="Fractale de Von Koch";Exemples_javascripts_inst[2]="Initialiser(); Viewport(0,0,600,400,1)\nDeplacer(100,100);\nDroite(90);\nAfficheGraphique();\nvar ch=Lsystems('F','F-F++F-F',4);\ninterprete(ch,2,60);\nDroite(120);\ninterprete(ch,2,60);\nDroite(120);\ninterprete(ch,2,60);\nDroite(120);\n";Exemples_javascripts_fonctions[2]="function Lsystems(current,regles,n) {\n  if (n<1)\n    return current;\n  else {\n    var res='';\n    var i;\n    for (i=0; i<current.length; i++) {\n      if (current.charAt(i) == 'F') {\n        res=res+regles;\n      } else {\n        res=res+current.charAt(i);\n      }\n    }\n    return Lsystems(res,regles,n-1);\n  }\n}\n\nfunction interprete(ch,l,a) {\n  var i;\n  for (i=0; i<ch.length; i++) {\n    switch (ch.charAt(i)) {\n    case 'F' : Avancer(l); break;\n    case '+' : Droite(a); break;\n    case '-' : Gauche(a); break;\n    }\n  }\n}\n";Exemples_javascripts_nom[3]="Fractale Ensemble de Mandelbrot";Exemples_javascripts_inst[3]="Initialiser(); Viewport(0,0,300,200,1);\nHideTurtle();\nAfficheGraphique();\nMandelbrot();\nStop('');\nDrawTurtle();\n";Exemples_javascripts_fonctions[3]="function TranslateX(x) {\n return x*3/300-2;\n}\n\nfunction TranslateY(y) {\n return (y-100)*3/200;\n}\n\n\nfunction Mandelbrot() {\n var i;\n var j;\n for(i=0; i<300; i++) {\n  for(j=0; j<200; j++) {\n  var macouleur=CouleurMandelbrot(TranslateX(i),TranslateY(j));\n   var chcouleur='rgb('+((macouleur*4)%256)+',0,0)';\n   RectanglePlein(i,j,1,1,chcouleur);\n  }\n }\n}\n\nfunction module(x,y) {\n return Math.sqrt(x*x+y*y);\n}\n\nfunction CouleurMandelbrot(a,b) {\n var i=0;\n var x=a;\n var y=b;\n do {\n  var tmp=x;\n  x=x*x-y*y+a;\n  y=2*tmp*y+b;\n                i++;\n }\n while ((module(x,y)<2) && (i<50));\n return 50-i;\n}";function putExemple(i){if(Exemples_javascripts_inst[i]!='')GEBID('lecode').value=Exemples_javascripts_inst[i];if(Exemples_javascripts_fonctions[i]!='')GEBID('lecode').value+=Exemples_javascripts_fonctions[i];editor.setValue(GEBID('lecode').value);GEBID('titre_onglet').selectedIndex=0;MontreFenetre(0);}
  function ConstruitExemples(){var i;document.writeln('<ul>');for(i=0;i<Exemples_javascripts_nom.length;i++){document.writeln('<li><a href="javascript:(void(0))" onclick="putExemple('+i+')">'+Exemples_javascripts_nom[i]+'</a></li>');}
  document.writeln('</ul>');}
  function chronometre(instruction){var avant=new Date();eval(instruction);var apres=new Date();return((apres.getSeconds()-avant.getSeconds())*1000+(apres.getMilliseconds()-avant.getMilliseconds()));}
  function builtin_max(a,b){if(a<b)return b;else
  return a;}
  function InitGraphic(){canvas=GEBID('mycanvas');ctx=canvas.getContext('2d');DrawTurtle();CacheGraphique();}
  function AfficheGraphique(){fenetre_courante=builtin_fenetregraphique;MontreFenetre(0);}
  function CacheGraphique(){}
  function Effacer(){HideTurtle();ctx.clearRect(0,0,size_canvas_x,size_canvas_y);DrawTurtle();}
  function Rotation(angle){ctx.setTransform(Math.cos(angle*3.14/180),Math.sin(angle*3.14/180),-Math.sin(angle*3.14/180),Math.cos(angle*3.14/180),1,1);}
  function Transformation(a,b,c,d,e,f){ctx.setTransform(a,b,c,d,e,f);}
  function Initialiser(){currentx=0;currenty=0;currentcolor='black';ctx.strokeStyle=currentcolor;ctx.fillStyle=currentcolor;ctx.lineWidth=1;currentangle=0;plotflag=true;Viewport(0,0,size_canvas_x,size_canvas_y,1);Deplacer(200,200);Rotation(0);ShadowOff();Effacer();HideTurtle();}
  var canvas;var ctx;var currentx=0;var currenty=0;var plotflag=true;var currentcolor='black';var currentangle=0;var currentMask;var currentMaskX=0;var currentMaskY=0;var sizeTurtle=10;var minviewport_x=0;var minviewport_y=0;var maxviewport_x=480;var maxviewport_y=300;var viewport_dir=-1;var turtleEnabled=true;function Viewport(minx,miny,maxx,maxy,dir){minviewport_x=minx;minviewport_y=miny;maxviewport_x=maxx;maxviewport_y=maxy;viewport_dir=dir;}
  function ViewX(x){x=(x-minviewport_x)*size_canvas_x/(maxviewport_x-minviewport_x);if(x<0)return 0;if(x>=size_canvas_x)return size_canvas_x-1;return x;}
  function ViewY(y){if(viewport_dir==1)y=(y-minviewport_y)*size_canvas_y/(maxviewport_y-minviewport_y);else
  y=size_canvas_y-(y-minviewport_y)*size_canvas_y/(maxviewport_y-minviewport_y);if(y<0)return 0;if(y>=size_canvas_y)return size_canvas_y-1;return y;}
  function ShadowOn(){ctx.shadowColor='black';ctx.shadowBlur=3;ctx.shadowOffsetX=3;ctx.shadowOffsetY=3;}
  function ShadowOff(){ctx.shadowColor='black';ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;}
  function Ligne(x0,y0,x1,y1,color){ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(ViewX(x0),ViewY(y0));ctx.lineTo(ViewX(x1),ViewY(y1));ctx.closePath();ctx.stroke();}
  function Cercle(x0,y0,r,color){Ellipse(x0,y0,r,r,color);}
  function CerclePlein(x0,y0,r,color){EllipsePlein(x0,y0,r,r,color);}
  function DrawImage(imageurl,x,y,w,h){var monim=new Image();monim.src=imageurl.replace(/^[\s\n]+/g,'').replace(/[\s\n]+$/g,'').replace(/\n/g,'');monim.onload=function(){ctx.drawImage(this,ViewX(x),ViewY(y),ViewX(w),ViewY(h));};}
  function Polygone(){var args=Polygone.arguments;if(args.length%2!=0&&args.length>2){var color=args[args.length-1];ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(ViewX(args[0]),ViewY(args[1]));for(var i=0;i<args.length-1;i+=2){ctx.lineTo(ViewX(args[i]),ViewY(args[i+1]));}
  ctx.lineTo(ViewX(args[0]),ViewY(args[1]));ctx.closePath();ctx.stroke();}else{alert('Wrong number of arguments in Polygone');}}
  function PolygonePlein(){var args=PolygonePlein.arguments;if(args.length%2!=0&&args.length>2){var color=args[args.length-1];ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(ViewX(args[0]),ViewY(args[1]));for(var i=0;i<args.length-1;i+=2){ctx.lineTo(ViewX(args[i]),ViewY(args[i+1]));}
  ctx.lineTo(ViewX(args[0]),ViewY(args[1]));ctx.closePath();ctx.fill();}else{alert('Wrong number of arguments in PolygonePlein');}}
  function Ellipse(x,y,w,h,color){x-=w/2;y-=h/2;var kappa=.5522848;ox=(w/2)*kappa,oy=(h/2)*kappa,xe=x+w,ye=y+h,xm=x+w/2,ym=y+h/2;ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(ViewX(x),ViewY(ym));ctx.bezierCurveTo(ViewX(x),ViewY(ym-oy),ViewX(xm-ox),ViewY(y),ViewX(xm),ViewY(y));ctx.bezierCurveTo(ViewX(xm+ox),ViewY(y),ViewX(xe),ViewY(ym-oy),ViewX(xe),ViewY(ym));ctx.bezierCurveTo(ViewX(xe),ViewY(ym+oy),ViewX(xm+ox),ViewY(ye),ViewX(xm),ViewY(ye));ctx.bezierCurveTo(ViewX(xm-ox),ViewY(ye),ViewX(x),ViewY(ym+oy),ViewX(x),ViewY(ym));ctx.closePath();ctx.stroke();}
  function EllipsePlein(x,y,w,h,color){x-=w/2;y-=h/2;var kappa=.5522848;ox=(w/2)*kappa,oy=(h/2)*kappa,xe=x+w,ye=y+h,xm=x+w/2,ym=y+h/2;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(ViewX(x),ViewY(ym));ctx.bezierCurveTo(ViewX(x),ViewY(ym-oy),ViewX(xm-ox),ViewY(y),ViewX(xm),ViewY(y));ctx.bezierCurveTo(ViewX(xm+ox),ViewY(y),ViewX(xe),ViewY(ym-oy),ViewX(xe),ViewY(ym));ctx.bezierCurveTo(ViewX(xe),ViewY(ym+oy),ViewX(xm+ox),ViewY(ye),ViewX(xm),ViewY(ye));ctx.bezierCurveTo(ViewX(xm-ox),ViewY(ye),ViewX(x),ViewY(ym+oy),ViewX(x),ViewY(ym));ctx.closePath();ctx.fill();}
  function Rectangle(x,y,l,h,color){ctx.strokeStyle=color;ctx.strokeRect(ViewX(x),ViewY(y),l*size_canvas_x/(maxviewport_x-minviewport_x),h*size_canvas_y/(maxviewport_y-minviewport_y))}
  function RectanglePlein(x,y,l,h,color){ctx.fillStyle=color;ctx.fillRect(ViewX(x),ViewY(y),(l*size_canvas_x/(maxviewport_x-minviewport_x)),(h*size_canvas_y/(maxviewport_y-minviewport_y)));}
  function Point(x,y,color){ctx.fillStyle=color;ctx.fillRect(ViewX(x),ViewY(y),1,1);}
  function getPointColor(x,y){return ctx.getImageData(x,y,1,1).data;}
  function Texte(x,y,ch,color){ctx.fillStyle=color;var ecart=ctx.measureText('oo').width;var T=[];ch=ch.toString();if(typeof(ch)=='string')T=ch.split('\n');for(var i=0;i<T.length;i++){ctx.fillText(T[i],ViewX(x),ViewY(y)+i*ecart);}}
  function setCanvasFont(_fontname,_fontsize,_extrastyle){ctx.font=_extrastyle+' '+_fontsize+' '+_fontname;}
  function GradientLineaire(couleur1,couleur2,xd,yd,xf,yf){var grd=ctx.createLinearGradient(ViewX(xd),ViewY(yd),ViewX(xf),ViewY(yf));grd.addColorStop(0,couleur1);grd.addColorStop(1,couleur2);return grd;}
  function AfficherCourbe(){if(AfficherCourbe.arguments.length==0){alert('ERROR AfficherCourbe/DrawTable\nUsage: AfficherCourbe/DrawTable(tab,[addition, filled, ColorLine, TypePoint=".OX", lineWidth])');return;}
  var tab=AfficherCourbe.arguments[0];var addition,filled,ColorLine,TypePoint,Eppline;if(AfficherCourbe.arguments.length>1)addition=AfficherCourbe.arguments[1];else addition=false;if(AfficherCourbe.arguments.length>2)filled=AfficherCourbe.arguments[2];else filled=true;if(AfficherCourbe.arguments.length>3)ColorLine=AfficherCourbe.arguments[3];else ColorLine='rgb(255,0,0)';if(AfficherCourbe.arguments.length>4)TypePoint=AfficherCourbe.arguments[4];else TypePoint='O';if(AfficherCourbe.arguments.length>5)Eppline=AfficherCourbe.arguments[5];else Eppline=5;if(!addition){Initialiser();var minx=0;var miny=0;var maxx=0;var maxy=0;var x;var y;if(tab.length>0){if(typeof(tab[0])!="object"){minx=0;maxx=0;miny=tab[0];maxy=tab[0];}else{minx=tab[0][0];maxx=tab[0][0];miny=tab[0][1];maxy=tab[0][1];}}
  for(var i=0;i<tab.length;i++){if(typeof(tab[i])!="object"){x=i;y=tab[i];}else{x=tab[i][0];y=tab[i][1];}
  if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;}
  Viewport(minx,miny,maxx,maxy,-1);}
  if(filled)CourbesFill(tab,'rgb(200,200,255)');Courbes(tab,ColorLine,Eppline);AllPoints(tab,ColorLine,TypePoint);}
  function CourbesFill(tab,color){ctx.fillStyle=color;ctx.strokeStyle='black';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ViewX(minviewport_x),ViewY(minviewport_y));for(var i=0;i<tab.length;i++){if(typeof(tab[i])!="object")ctx.lineTo(ViewX(i),ViewY(tab[i]));else{ctx.lineTo(ViewX(tab[i][0]),ViewY(tab[i][1]));}}
  ctx.lineTo(ViewX(maxviewport_x),ViewY(minviewport_y));ctx.closePath();ctx.fill();ctx.lineWidth=1;}
  function Courbes(tab,color,epp){var x,y;ctx.strokeStyle=color;ctx.lineWidth=epp;ctx.beginPath();for(var i=0;i<tab.length;i++){if(typeof(tab[i])!="object"){x=ViewX(i);y=ViewY(tab[i]);}else{x=ViewX(tab[i][0]);y=ViewY(tab[i][1]);}
  if(i==0)ctx.moveTo(x,y);else
  ctx.lineTo(x,y);}
  ctx.stroke();ctx.lineWidth=1;}
  function AllPoints(tab,color,typep){ctx.fillStyle=color;ctx.lineWidth=1;var x,y;for(var i=0;i<tab.length;i++){if(typeof(tab[i])!="object"){x=ViewX(i);y=ViewY(tab[i]);}else{x=ViewX(tab[i][0]);y=ViewY(tab[i][1]);}
  if(typep=="O"){ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2,true);ctx.fill();}else if(typep=="X"){ctx.beginPath();ctx.moveTo(x-5,y-5);ctx.lineTo(x+5,y+5);ctx.moveTo(x-5,y+5);ctx.lineTo(x+5,y-5);ctx.stroke();}}
  ctx.lineWidth=1;}
  function DrawTurtle(){if(turtleEnabled){currentMaskX=builtin_max(0,ViewX(currentx)-sizeTurtle*2);currentMaskY=builtin_max(0,ViewY(currenty)-sizeTurtle*2);currentMask=ctx.getImageData(currentMaskX,currentMaskY,sizeTurtle*2*2,sizeTurtle*2*2);ctx.fillStyle='blue';ctx.lineWidth=1;ctx.strokeStyle='black';ctx.beginPath();ctx.moveTo(ViewX(currentx),ViewY(currenty));ctx.lineTo(ViewX(currentx)+0.5*sizeTurtle*Math.cos(currentangle*3.14/180),ViewY(currenty)-0.5*sizeTurtle*Math.sin(currentangle*3.14/180));ctx.lineTo(ViewX(currentx)-sizeTurtle*Math.sin(currentangle*3.14/180),ViewY(currenty)-1.5*sizeTurtle*Math.cos(currentangle*3.14/180));ctx.lineTo(ViewX(currentx)-0.5*sizeTurtle*Math.cos(currentangle*3.14/180),ViewY(currenty)+0.5*sizeTurtle*Math.sin(currentangle*3.14/180));ctx.closePath();ctx.fill();}}
  var tortx=0;var torty=0;var tortdir=270;var Tcos=[];for(var i=0;i<360*4;i++)Tcos[i]=Math.cos(i/4*Math.PI/180);function eCos(a){a=Math.floor(4*a)%1440;return Tcos[a];}
  function eSin(a){return eCos(a+270);}
  function eDeplacer(x,y){currentx=x;currentx=y;}
  function eAvancer(L){var ox=currentx,oy=currenty;currenty-=L*eCos(currentangle);currentx+=L*eSin(currentangle);ctx.beginPath();ctx.strokeStyle=currentcolor;ctx.moveTo(ox,oy);ctx.lineTo(currentx,currenty);ctx.stroke();}
  function eDroite(a){while(a<0)a+=360;currentangle=(currentangle+a)%360;}
  function eGauche(a){eDroite(-a);}
  function HideTurtle(){if(turtleEnabled){ctx.putImageData(currentMask,currentMaskX,currentMaskY);}}
  function Gauche(a){currentangle=(currentangle+a)%360;HideTurtle();DrawTurtle();}
  function Droite(a){currentangle=(360+currentangle-a)%360;HideTurtle();DrawTurtle();}
  function Avancer(l){var newx=currentx-l*eSin(currentangle);var newy=currenty-l*eCos(currentangle);HideTurtle();if(plotflag){Ligne(currentx,currenty,newx,newy,currentcolor);}
  currentx=newx;currenty=newy;DrawTurtle();}
  function Deplacer(x,y){HideTurtle();currentx=x;currenty=y;DrawTurtle();}
  function Baisser(){plotflag=true;}
  function Couleur(c){currentcolor=c;}
  function Lever(){plotflag=false;}
  function Caractere_vers_Ascii(c){if(typeof(c)==='string')
  return c.charCodeAt(0);else{alert("Erreur dans l'appel de Caractere_vers_Ascii\nError when invoking toAscii");return-1;}}
  function Ascii_vers_Caractere(n){return String.fromCharCode(n);}
  function Majuscule(c){if(typeof(c)==='string')
  return c.toUpperCase();else{alert("Erreur dans l'appel de Majuscule\nError when invoking Uppercase");return"";}}
  function CaractereEn(ch,i){if(typeof(ch)==='string')
  return ch.charAt(i);else{alert("Erreur dans l'appel de CaractereEn");return"";}}
  function Longueur(ch){if(typeof(ch)==='string')
  return ch.length;else{alert("Erreur dans l'appel de Longueur\nError when invoking Length");return-1;}}
  function SousChaine(ch,deb,lo){if(typeof(ch)==='string')
  return ch.substr(deb,lo);else{alert("Erreur dans l'appel de SousChaine\nError when invoking Substr");return"";}}
  function PositionDans(ch,ch_cherchee){if(typeof(ch)==='string')
  return ch.indexOf(ch_cherchee);else{alert("Erreur dans l'appel de PositionDans\nError when invoking Search");return-1;}}
  function Tableau(){if(Tableau.arguments.length==0){return[];}else{if(Tableau.arguments.length==1){return new Array(Tableau.arguments[0]);}else{var nbl=Tableau.arguments[0];var nbc=Tableau.arguments[1];var zzz;var tmp=[];for(var i=0;i<nbl;i++){tmp[i]=[];for(var j=0;j<nbc;j++)tmp[i][j]=zzz;}
  return tmp;}}}
  function Taille(T){return T.length;}
  function InitialiserTableau(T,valeur){for(var i=0;i<T.length;i++){T[i]=valeur;}}
  function ConcateneTableaux(T1,T2){return T1.concat(T2);}
  function CombineTableauxL(T1,T2){return new Array(T1,T2);}
  function CombineTableauxC(T1,T2){var res=new Array();for(var i=0;i<builtin_max(T1.length,T2.length);i++){res[i]=new Array(T1[i],T2[i]);}
  return res;}
  function Renverser(T){return T.reverse();}
  function Numerique(a,b){return a-b;}
  function OrdreNumerique(T){var res=T.slice(0,T.length);return res.sort(Numerique);}
  function OrdreLexicographique(T){var res=T.slice(0,T.length);return res.sort();}
  function SousTableau(T,debut,longueur){return T.slice(debut,debut+longueur);}
  function Hasard(n){return(Math.random()*n)>>0;}
  function NormalizeAudio(T){var res=[];res[Taille(T)-1]=0;for(var i=0;i<Taille(T);i++){res[i]=Math.floor(128+128*T[i]);}
  return res;}
  function NormaliserSon(T){return NormalizeAudio(T);}
  function flattenArray(channelBuffer,recordingLength){var result=new Float32Array(recordingLength);var offset=0;for(var i=0;i<channelBuffer.length;i++){var buffer=channelBuffer[i];result.set(buffer,offset);offset+=buffer.length;}
  return result;}
  function interleave(leftChannel,rightChannel){var length=leftChannel.length+rightChannel.length;var result=new Float32Array(length);var inputIndex=0;for(var index=0;index<length;){result[index++]=leftChannel[inputIndex];result[index++]=rightChannel[inputIndex];inputIndex++;}
  return result;}
  function writeUTFBytes(view,offset,string){for(var i=0;i<string.length;i++){view.setUint8(offset+i,string.charCodeAt(i));}}
  function CreerSon16bits(T,sampleRate){var blob=null;var leftBuffer=T;var rightBuffer=T;var interleaved=interleave(leftBuffer,rightBuffer);var buffer=new ArrayBuffer(44+interleaved.length*2);var view=new DataView(buffer);writeUTFBytes(view,0,'RIFF');view.setUint32(4,44+interleaved.length*2,true);writeUTFBytes(view,8,'WAVE');writeUTFBytes(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);writeUTFBytes(view,36,'data');view.setUint32(40,interleaved.length*2,true);var index=44;var volume=1;for(var i=0;i<interleaved.length;i++){view.setInt16(index,interleaved[i]*(0x7FFF*volume),true);index+=2;}
  blob=new Blob([view],{type:'audio/wav'});var url=window.URL.createObjectURL(blob);var audio=new Audio(url);return audio;}
  function ExportSon16bits(T,sampleRate){var blob=null;var leftBuffer=T;var rightBuffer=T;var interleaved=interleave(leftBuffer,rightBuffer);var buffer=new ArrayBuffer(44+interleaved.length*2);var view=new DataView(buffer);writeUTFBytes(view,0,'RIFF');view.setUint32(4,44+interleaved.length*2,true);writeUTFBytes(view,8,'WAVE');writeUTFBytes(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);writeUTFBytes(view,36,'data');view.setUint32(40,interleaved.length*2,true);var index=44;var volume=1;for(var i=0;i<interleaved.length;i++){view.setInt16(index,interleaved[i]*(0x7FFF*volume),true);index+=2;}
  blob=new Blob([view],{type:'audio/wav'});var url=window.URL.createObjectURL(blob);window.open(url);}
  function getImagePoint(T,x,y){return[T.data[4*(T.width*y+x)],T.data[4*(T.width*y+x)+1],T.data[4*(T.width*y+x)+2],T.data[4*(T.width*y+x)+3]];}
  function setImagePoint(T,x,y,v){var transp=255;if(Taille(v)>3)transp=v[3];T.data[4*(T.width*y+x)]=v[0];T.data[4*(T.width*y+x)+1]=v[1];T.data[4*(T.width*y+x)+2]=v[2];T.data[4*(T.width*y+x)+3]=transp;}
  var ForWebcamvideo=document.createElement("video");ForWebcamvideo.setAttribute("width",640);ForWebcamvideo.setAttribute("height",480);var ForWebcamcanvas=document.createElement("canvas");ForWebcamcanvas.setAttribute("width",640);ForWebcamcanvas.setAttribute("height",480);var ForWebcamcontext=ForWebcamcanvas.getContext('2d');function ForWebcamProcess(f){if(ForWebcamvideo.paused||ForWebcamvideo.ended){return;}
  ForWebcamcontext.drawImage(ForWebcamvideo,0,0,640,480);var frame=ForWebcamcontext.getImageData(0,0,640,480);f(frame);setTimeout(function(){ForWebcamProcess(f);},0);}
  function StartWebcam(f){navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mediaDevices.GetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;navigator.getUserMedia({video:true},function(stream){ForWebcamvideo.srcObject=stream;ForWebcamvideo.play();ForWebcamProcess(f);},function(e){console.error(e);});}
  function StopWebcam(){ForWebcamvideo.pause();}
  var ForMicrorecorder=null;var ForMicromediaStream=null;var ForMicrosampleRate=44100;var ForMicrocontext=null;function StartMicrophone(f){navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mediaDevices.GetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;navigator.getUserMedia({audio:true},function(e){window.AudioContext=window.AudioContext||window.webkitAudioContext;ForMicrocontext=new AudioContext();ForMicromediaStream=ForMicrocontext.createMediaStreamSource(e);var bufferSize=2048;var numberOfInputChannels=2;var numberOfOutputChannels=2;if(ForMicrocontext.createScriptProcessor){ForMicrorecorder=ForMicrocontext.createScriptProcessor(bufferSize,numberOfInputChannels,numberOfOutputChannels);}else{ForMicrorecorder=ForMicrocontext.createJavaScriptNode(bufferSize,numberOfInputChannels,numberOfOutputChannels);}
  ForMicrorecorder.onaudioprocess=function(e){f(e.inputBuffer.getChannelData(0));};ForMicromediaStream.connect(ForMicrorecorder);ForMicrorecorder.connect(ForMicrocontext.destination);},function(e){console.error(e);});}
  function StopMicrophone(){ForMicrorecorder.disconnect(ForMicrocontext.destination);ForMicromediaStream.disconnect(ForMicrorecorder);}
  function resetVariables(){for(builtin_p in this){if((typeof(eval(builtin_p))=='number')||(typeof(eval(builtin_p))=='string')){if(">>>|name|scrollX|scrollY|status|defaultStatus|innerWidth|innerHeight|outerWidth|outerHeight|screenX|screenY|pageXOffset|pageYOffset|scrollMaxX|scrollMaxY|length|builtin_courant|builtin_codejs|builtin_wait|builtin_p|".lastIndexOf('|'+builtin_p+'|')<=0){eval(builtin_p+'=undefined');}}}}
  var size_canvas_x;var size_canvas_y;function Init(){GEBID('sortie').disabled=true;size_canvas_x=800;size_canvas_y=600;GEBID('mycanvas').ontouchstart=builtinMouseDown;GEBID('mycanvas').ontouchmove=builtincapturetouch;GEBID('mycanvas').ontouchend=builtinMouseUp;GEBID('mycanvas').onmousedown=builtinMouseDown;GEBID('mycanvas').onmouseup=builtinMouseUp;GEBID('mycanvas').onmousemove=builtinMouseMoveEvent;document.onkeydown=function(k){if(!k)k=window.event;Keypressed(k['keyCode']);var c=k.keyCode;if(builtin_keydowntime[c]==undefined){builtin_keydowntime[c]=new Date().getTime();Keydown(c);}
  if(k['keyCode']>=37&&k['keyCode']<=40)k.preventDefault();};document.onkeyup=function(e){if(!e)e=window.event;var c=e.keyCode;Keyup(c,((new Date().getTime())-builtin_keydowntime[c]));builtin_keydowntime[c]=undefined;};}
  var builtin_keydowntime=[];function Keydown(c){}
  function Keyup(c){}
  var builtin_allvariables='';function getAllVariablesInMemory(){var i=0;for(var p in window){if((typeof(eval("window."+p))=="number")||(typeof(eval("window."+p))=="boolean")||(typeof(eval("window."+p))=="string")){builtin_allvariables.push(p);}}}
  var builtin_wait=false;var builtin_courant='';var builtin_code=Array();var builtin_codejs;var builtin_verrou=-1;function Analyseur(ch){var nbinstructions=0;var instructions=Array();var deb=0;var current='';var parent=0;var accolade=0;var ligne=0;var motcle='';for(i=0;i<ch.length;i++){c=ch.charAt(i);if(c=='(')parent++;if(c==')')parent--;if(c=='{')accolade++;if(c=='}'){accolade--;}
  if("aabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".lastIndexOf(c)>0)motcle=motcle+c;else{if(motcle.length>0)alert(motcle);motcle='';}
  if(c=='\n'){ligne++;if(current=='')c='';else c='\n';}
  if((c.charAt(c.length-1)==";")&&(parent+accolade==0)){current=current+c+'\n';instructions[nbinstructions]=current;nbinstructions++;current='';}else{current=current+c;}}
  instructions[nbinstructions]=current;return instructions;}
  var Inspector_flag=false;var Variables_a_inspecter='';var contenu_memoire='';function Inspector_on(ch){Inspector_flag=true;Variables_a_inspecter=ch;}
  function Inspector_off(){Inspector_flag=false;}
  function Inspection(){alert('Execution trace\n--------------------------\n'+contenu_memoire);}
  function Inspecte(variables,obj){var toutesvariables_du_stop=variables.split(',');var afficher_du_stop='';var i_du_stop;var valeur_du_stop='';for(i_du_stop=0;i_du_stop<toutesvariables_du_stop.length;i_du_stop++){try{valeur_du_stop=globaleval('obj.'+toutesvariables_du_stop[i_du_stop]);}catch(e){valeur_du_stop='?';}finally{}
  if('++undefined'.lastIndexOf(valeur_du_stop)>0)valeur_du_stop='?';afficher_du_stop=afficher_du_stop+toutesvariables_du_stop[i_du_stop]+'='+valeur_du_stop+'\t';}
  contenu_memoire+=afficher_du_stop+'\n';}
  function find_reverse(ch,i,car){while((i>0)&&(ch[i]!=car))i--;return i;}
  function Evaluer(){var maxsauvegardes=20;Initialiser();BeginningEvent=true;contenu_memoire='';Variables_a_inspecter=GEBID('builtin_inspector').value;GEBID('lecode').value=editor.getValue();var tabcode=GEBID('lecode').value;if(DropboxSync&&FileExists('Sauvegardes/save'+maxsauvegardes+'.js')){client.filesDelete({path:'/'+'Sauvegardes/save'+maxsauvegardes+'.js'});}
  for(var i=maxsauvegardes-1;i>=0;i--){if(FileExists('Sauvegardes/save'+i+'.js')){if(DropboxSync&&FileExists('Sauvegardes/save'+maxsauvegardes+'.js')){client.filesMove({from_path:'/'+'Sauvegardes/save'+(i)+'.js',to_path:'/'+'Sauvegardes/save'+(i+1)+'.js'});}
  window.localStorage['Sauvegardes/save'+(i+1)+'.js']=window.localStorage['Sauvegardes/save'+i+'.js'];}}
  writeFile('Sauvegardes/save0.js',tabcode);if(Variables_a_inspecter!=''){var ch=tabcode;tabcode='';var nbparenthesis=0;var toutesvariables_du_stop=Variables_a_inspecter.split(',');var afficher_du_stop='';var i_du_stop;var valeur_du_stop='';contenu_memoire+=afficher_du_stop+'\n';try{valeur_du_stop=globaleval('window.'+toutesvariables_du_stop[i_du_stop]);}catch(e){valeur_du_stop='?';}finally{}
  var k=1;for(var i=0;i<ch.length;i++){if((ch.charAt(i)==';')&&(nbparenthesis==0)){tabcode+=';';revi=find_reverse(ch,i,'\n');if((i-revi)>20)chaineaaffichermem=ch.substr(revi+1,10)+''+ch.substr(i-10,10);else chaineaaffichermem=ch.substring(revi+1,i);tabcode+='contenu_memoire+="'+(k++)+') ['+chaineaaffichermem+'] => ";';for(i_du_stop=0;i_du_stop<toutesvariables_du_stop.length;i_du_stop++){tabcode+='try {contenu_memoire+="'+toutesvariables_du_stop[i_du_stop]+'="+((typeof(eval("'+toutesvariables_du_stop[i_du_stop]+'")) == "string")?"\'"+eval("'+toutesvariables_du_stop[i_du_stop]+'")+"\'":eval("'+toutesvariables_du_stop[i_du_stop]+'")) +", ";} catch (e) {contenu_memoire+="'+toutesvariables_du_stop[i_du_stop]+'=undefined, ";} finally {}; ';}
  tabcode+='contenu_memoire+="\\n"; ';}else tabcode+=ch.charAt(i);if(ch.charAt(i)=='('){nbparenthesis++;}
  if(ch.charAt(i)==')'){nbparenthesis--;}}}
  if(builtin_allvariables==''){var ch='|';var p;for(p in window){var letype=""
  try{letype=typeof(eval('window.'+p));}catch(e){letype="NONE";}finally{}
  if((letype=="string")||(letype=="boolean")||(letype=="number")){ch=ch+p+'|';}}
  builtin_allvariables=ch;}else{var supprimees="";var p;for(p in window){var letype=""
  try{letype=typeof(eval('window["'+p+'"]'));}catch(e){letype="NONE";}finally{}
  if((letype=="string")||(letype=="boolean")||(letype=="number")){if(builtin_allvariables.indexOf('|'+p+'|')<0){Ecrire("Suppression de ("+p+")");eval('delete window["'+p+'"];');}}}}
  builtin_courant='';GEBID('sortie').value=builtin_courant;var submemory=[];with(submemory)globaleval(tabcode);if(Variables_a_inspecter!=''){Inspection();}}
  function Evaluer_debug(){Initialiser();BeginningEvent=true;contenu_memoire='';document.getElementById('lecode').value=editor.getValue();var tabcode=GEBID('lecode').value;builtin_courant='';document.getElementById('sortie').value=builtin_courant;globaleval(tabcode);}
  function Executer(ligne,temporisation){if(ligne<builtin_code.length){lecode="";flag=false;for(i=0;i<builtin_code.length;i++){if(flag)lecode=lecode+'';flag=true;if(i==ligne)symbole=">>>> ";else symbole="";lecode=lecode+symbole+builtin_code[i];}
  document.getElementById('lecode').value=lecode;try{globaleval(builtin_code[ligne]);}catch(err){alert("Error of type : "+err.message);}finally{setTimeout('Executer('+(ligne+1)+','+temporisation+')',temporisation);}}else{lecode="";flag=false;for(i=0;i<builtin_code.length;i++){if(flag)lecode=lecode;flag=true;lecode=lecode+builtin_code[i];}
  document.getElementById('lecode').value=lecode;}}
  function Afficher(){var ch='';for(var i=0;i<Afficher.arguments.length;i++)ch+=Afficher.arguments[i];builtin_courant=builtin_courant+'FONCTION OBSOLETE, UTILISEZ Ecrire A LA PLACE : '+ch+"\n";document.getElementById('sortie').value=builtin_courant;}
  function EffacerEcran(){builtin_courant="";GEBID('sortie').value=builtin_courant;}
  function Ecrire(){var ch='';for(var i=0;i<Ecrire.arguments.length;i++)ch+=Ecrire.arguments[i];builtin_courant=builtin_courant+ch+"\n";document.getElementById('sortie').value=builtin_courant;}
  function Parle(txt){var discours=new SpeechSynthesisUtterance(txt);discours.voice=builtin_voice;window.speechSynthesis.speak(discours);}
  var builtin_language;var builtin_voice;function getVoiceFromLanguage(lang){var voices=window.speechSynthesis.getVoices();for(var i=0;i<voices.length;i++)if(voices[i].lang==lang){return voices[i];}
  return voices[0];}
  function setLanguage(lang){builtin_language=lang;builtin_voice=getVoiceFromLanguage(lang);}
  setLanguage('fr-FR');function EcrireAudio(txt){Parle(txt);Ecrire(txt);}
  function SaisieAudio(txt){Parle(txt);return Saisie(txt);}
  var SpeechRecognition=SpeechRecognition||webkitSpeechRecognition;var builtin_recognition=new SpeechRecognition();builtin_recognition.continuous=false;var builtin_recognitionon=false;function StartSpeechRecognition(callback){builtin_recognition.lang=builtin_language;builtin_recognition.onresult=function(event){if(builtin_recognitionon){for(i=event.resultIndex;i<event.results.length;i++){console.log("J'ai compris : "+event.results[i][0].transcript);callback(event.results[i][0].transcript);}
  builtin_recognition.stop();}};builtin_recognition.onend=function(event){if(builtin_recognitionon){StartSpeechRecognition(callback);}};builtin_recognitionon=true;builtin_recognition.start();}
  function StopSpeechRecognition(){builtin_recognitionon=false;builtin_recognition.stop();}
  function Afficher_srl(){var ch='';for(var i=0;i<Afficher_srl.arguments.length;i++)ch+=Afficher_srl.arguments[i];builtin_courant=builtin_courant+ch;document.getElementById('sortie').value=builtin_courant;}
  var enablePrettyPrompt=false;function setPrettyPrompt(){enablePrettyPrompt=true;}
  function unsetPrettyPrompt(){enablePrettyPrompt=false;}
  function myPrompt(message){window.builtin_nbprompt++;var r=0;if(enablePrettyPrompt&&typeof(window.showModalDialog)=='function'&&(window.builtin_nbprompt<11)&&(!(navigator.userAgent.indexOf('Android')>0))&&(!(navigator.userAgent.indexOf('KHTML')>0))){message=message.replace(/\n/g,'<br/>');r=window.showModalDialog('data:text/html;base64,PGh0bWw+PGhlYWQ+PG1ldGEgY2hhcnNldD0iVVRGLTgiPjx0aXRsZT5GZW4mZWNpcmM7dHJlIGRlIHNhaXNpZSBBbGdvU2NyaXB0PC90aXRsZT48L2hlYWQ+Cjxib2R5IHN0eWxlPSJmb250LWZhbWlseTogaGVsdmV0aWNhLCBzYW5zLXNlcmlmLCBhcmlhbDsgZm9udC1zaXplOiAxLjVlbTsgd2lkdGg6IDEwMCU7IGhlaWdodDogYXV0bzogbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBjZW50ZXI7IG92ZXJmbG93LXg6IGhpZGRlbjsgb3ZlcmZsb3cteTogYXV0bzsgYmFja2dyb3VuZC1jb2xvcjogb3JhbmdlOyBjb2xvcjogYmxhY2s7IiBvbmxvYWQ9ImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb28nKS5mb2N1cygpOyIgb251bmxvYWQ9IndpbmRvdy5yZXR1cm5WYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb28nKS52YWx1ZTsiPgo8ZGl2IHN0eWxlPSJwb3NpdGlvbjogZml4ZWQ7IHRvcDowcHg7IGxlZnQ6IDBweDsgaGVpZ2h0OiA3MCU7IHdpZHRoOiAxMDAlOyB0ZXh0LWFsaWduOiBjZW50ZXI7IG1hcmdpbjogYXV0bzsiPgo8c2NyaXB0Pgp3aW5kb3cucmVzaXplVG8oMzAwLDI1MCk7CmRvY3VtZW50LndyaXRlKHdpbmRvdy5kaWFsb2dBcmd1bWVudHMpOwo8L3NjcmlwdD4KPGJyLz4KPGJyLz4KPC9kaXY+CjxkaXYgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwcHg7ICBoZWlnaHQ6IDgwcHg7IHRleHQtYWxpZ246IGNlbnRlcjsiPgo8aW5wdXQgc3R5bGU9ImZvbnQtZmFtaWx5OiBoZWx2ZXRpY2EsIHNhbnMtc2VyaWYsIGFyaWFsOyBmb250LXNpemU6IDEuNWVtOyB3aWR0aDogOTAlOyBoZWlnaHQ6IDQwcHg7IiBpZD0iZm9vIiB0eXBlPSJ0ZXh0IiB2YWx1ZT0iIiBvbmNoYW5nZT0id2luZG93LnJldHVyblZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbycpLnZhbHVlOyB3aW5kb3cuY2xvc2UoKTsiPjxici8+CjxpbnB1dCBzdHlsZT0iZm9udC1mYW1pbHk6IGhlbHZldGljYSwgc2Fucy1zZXJpZiwgYXJpYWw7IGZvbnQtc2l6ZTogMS41ZW07IiB0eXBlPSJidXR0b24iIHZhbHVlPSJPSyIgb25jbGljaz0id2luZG93LnJldHVyblZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbycpLnZhbHVlOyB3aW5kb3cuY2xvc2UoKTsiPgo8L2Rpdj4KPC9ib2R5Pgo8L2h0bWw+',message,'dialogwidth:50px; dialogLeft:'+Math.floor(window.innerWidth/2-150)+'px; dialogtop:'+Math.floor(window.innerHeight/2-125)+'px; dialogheight:50px; resizable:yes; status:no;');}else{r=prompt(message);}
  return r;}
  if(navigator.userAgent.indexOf('KHTML')>0)unsetPrettyPrompt();if(navigator.userAgent.indexOf('Android')>0)unsetPrettyPrompt();function SaisieEntier(){var i;var test;var nb;var ch;do{if(SaisieEntier.arguments.length>0)ch=SaisieEntier.arguments[0]+'\n';else ch='';nb=myPrompt(ch+'\nPlease enter an Integer');test=true;for(i=0;i<nb.length;i++)
  test=test&&("0-0123456789".lastIndexOf(nb.charAt(i))>0);}while(!test);return nb*1;}
  function SaisieReel(){var i;var test;var nbpoint;var nb;var ch;do{if(SaisieReel.arguments.length>0)ch=SaisieReel.arguments[0]+'\n';else ch='';nb=myPrompt(ch+'\nPlease enter a Real');test=true;nbpoint=0;}while(!test);return nb*1;}
  function SaisieChaine(){var ch;if(SaisieChaine.arguments.length>0)ch=SaisieChaine.arguments[0]+'\n';else ch='';return myPrompt(ch+'\nPlease enter a String');}
  function Saisie(){var ch;if(Saisie.arguments.length>0)ch=Saisie.arguments[0]+'\n';else ch='';return myPrompt(ch+'\nPlease enter a String');}
  function enReel(nb){return 1*nb;}
  function enEntier(nb){return 1*nb;}
  function enChaine(nb){return nb+'';}
  function Stop(){alert('Break point');}
  function Stop(variables){var toutesvariables_du_stop=variables.split(',');var afficher_du_stop='Break point\n';var i_du_stop;var valeur_du_stop='';for(i_du_stop=0;i_du_stop<toutesvariables_du_stop.length;i_du_stop++){try{valeur_du_stop=globaleval('window.'+toutesvariables_du_stop[i_du_stop]);}catch(e){valeur_du_stop='?';}finally{}
  if('++undefined'.lastIndexOf(valeur_du_stop)>0)valeur_du_stop='?';afficher_du_stop=afficher_du_stop+toutesvariables_du_stop[i_du_stop]+'='+valeur_du_stop+'\n';}
  alert(afficher_du_stop);}
  function builtin_waitOn(){this.builtin_wait=true;setTimeout('builtin_waitOff()',500);}
  function builtin_waitOff(){this.builtin_wait=false;}
  function Help(){GEBID('Aide').style.visibility='visible';}
  var builtin_fg=false;function FenetreGraphique(){if(builtin_fg){CacheGraphique();GEBID('bouton_fg').style.backgroundColor='rgb(230,230,230)';GEBID('bouton_fg').style.color='black';builtin_fg=false;}else{AfficheGraphique();GEBID('bouton_fg').style.backgroundColor='red';GEBID('bouton_fg').style.color='black';builtin_fg=true;}}
  var positionTUTOX=0;var positionTUTOY=0;function MoveTuto(x,y){positionTUTOX=x;positionTUTOY=y;GEBID('divtuto').style.left=x+'px';GEBID('divtuto').style.top=y+'px';}
  function Deplacement(debut,fin,t,nbsteps){return fin*t/nbsteps+debut*(1-t/nbsteps);}
  function rgb(r,v,b){return'rgb('+(r>>0)+','+(v>>0)+','+(b>>0)+')';}
  function rgba(r,v,b,a){return'rgba('+(r>>0)+','+(v>>0)+','+(b>>0)+','+a+')';}
  function MonInnerHTML(b,ch){b.innerHTML=ch;}
  function MonInnerHTML_value(b,ch){b.value=ch;}
  function HTMLoutput(ch){var maframe=GEBID('frameweboutput').contentDocument
  maframe.open();maframe.writeln(ch);maframe.close();}
  var mouseX=0,mouseY=0,clearTimeoutEvent=0,FrameRate=1000;function builtinSetMouseXY(e){mouseX=e.layerX*(maxviewport_x-minviewport_x)/size_canvas_x+minviewport_x;mouseY=e.layerY*(maxviewport_y-minviewport_y)/size_canvas_y+minviewport_y;}
  window.onmousemove=builtinSetMouseXY;function setup(){}
  function draw(){}
  function MouseClick(x,y){}
  var BeginningEvent=true;var BeginningTime;function Loop(ms){if(typeof(clearTimeoutEvent)!='undefined')clearTimeout(clearTimeoutEvent);if(BeginningEvent){setup();BeginningTime=new Date();BeginningEvent=false;}
  draw();if(ms>0){var time=new Date();var ecoule=(time.getSeconds()-BeginningTime.getSeconds())*1000+(time.getMilliseconds()-BeginningTime.getMilliseconds());}else{ecoule=ms-1;}
  if(ecoule<ms){clearTimeoutEvent=setTimeout('Loop('+ms+')',1000/FrameRate);}else BeginningEvent=true;}
  function noLoop(){if(typeof(clearTimeoutEvent)!='undefined')clearTimeout(clearTimeoutEvent);}
  var fenetre_courante;var builtin_fenetregraphique=2;function getTransformProperty(element){var properties=['transform','WebkitTransform','msTransform','MozTransform','OTransform'];var p;while(p=properties.shift()){if(typeof element.style[p]!='undefined'){return p;}}
  return false;}
  function RetailleFenetre(fen,viz,zindex,echelleX,echelleY){var leselect=GEBID('titre_onglet');if(leselect){var tr=getTransformProperty(GEBID(leselect.options[fen].value));if(tr){GEBID(leselect.options[fen].value).style.visibility=viz;GEBID(leselect.options[fen].value).style.zIndex=zindex;GEBID(leselect.options[fen].value).style[tr]='scaleX('+echelleX+') scaleY('+echelleY+')';}}}
  function MontreFenetre(nb){var leselect=GEBID('titre_onglet');if(leselect){if((fenetre_courante+nb>=0)&&(fenetre_courante+nb<Taille(leselect.options))){GEBID(leselect.options[fenetre_courante].value).style.visibility='hidden';GEBID(leselect.options[fenetre_courante].value).style.zIndex=-1;if(leselect.options[fenetre_courante].value=='lecode'){editor.getTextArea().style.visibility='hidden';editor.getTextArea().style.zIndex=-1;}
  if(fenetre_courante==leselect.selectedIndex){fenetre_courante+=nb;leselect.selectedIndex=fenetre_courante;}else
  fenetre_courante=leselect.selectedIndex;GEBID(leselect.options[fenetre_courante].value).style.visibility='visible';if(leselect.value=='GestionFichiers')UpdateFS();if(builtin_verrou>=0){if(builtin_verrou==fenetre_courante){RetailleFenetre(builtin_verrou,'visible',100,1,1);}else{RetailleFenetre(builtin_verrou,'visible',200,0.5,0.5);}}
  if(leselect.value=='lecode'){editor.getTextArea().style.visibility='visible';editor.getTextArea().style.zIndex=101;}
  GEBID(leselect.options[fenetre_courante].value).style.zIndex=100;window.scrollTo(0,1);}}}
  function TailleBoite(b,x,y){if(b){b.style.width=x+'px';if(y!='auto')b.style.height=y+'px';else b.style.height=y;}}
  function AdapterTaille(x,y){TailleBoite(GEBID('sortie'),x,y-30);TailleBoite(GEBID('lecode'),x-10,'auto');TailleBoite(editor.getTextArea(),x,'auto');TailleBoite(GEBID('credits'),x,'auto');TailleBoite(GEBID('GestionFichiers'),x,'auto');TailleBoite(GEBID('resizecode'),x-10,y-30);editor.getWrapperElement().style.position='absolute';editor.getWrapperElement().style.width=(x-10)+'px';editor.getWrapperElement().style.height=(y-30)+'px';TailleBoite(GEBID('Aide'),x,y-30);TailleBoite(GEBID('divtuto'),x,y-30);TailleBoite(GEBID('mycanvas'),x,y-30);size_canvas_x=x;size_canvas_y=y-30;GEBID('mycanvas').width=x;GEBID('mycanvas').height=(y-30);TailleBoite(GEBID('SaisieTexte'),x,'auto');TailleBoite(GEBID('MonTexte'),x,y-30);TailleBoite(GEBID('weboutput'),x,y-30);if(x<=419){TailleBoite(GEBID('boutons'),x,61);editor.getWrapperElement().style.top='60px';GEBID('sortie').style.top='60px';GEBID('GestionFichiers').style.top='60px';GEBID('lecode').style.top='60px';editor.getTextArea().style.top='60px';GEBID('Aide').style.top='60px';GEBID('credits').style.top='60px';GEBID('divtuto').style.top='60px';GEBID('mycanvas').style.top='60px';GEBID('SaisieTexte').style.top='60px';GEBID('weboutput').style.top='60px';}else{TailleBoite(GEBID('boutons'),x,31);editor.getWrapperElement().style.top='30px';GEBID('sortie').style.top='30px';GEBID('lecode').style.top='30px';editor.getTextArea().style.top='30px';GEBID('GestionFichiers').style.top='30px';GEBID('Aide').style.top='30px';GEBID('credits').style.top='30px';GEBID('divtuto').style.top='30px';GEBID('mycanvas').style.top='30px';GEBID('SaisieTexte').style.top='30px';GEBID('weboutput').style.top='30px';}}
  function AdapterTaille2(x,y){TailleBoite(GEBID('sortie'),x,y);TailleBoite(GEBID('mycanvas'),x,y);size_canvas_x=x;size_canvas_y=y;GEBID('mycanvas').width=x;GEBID('mycanvas').height=y;}
  function InitImages(){GEBID('MemExec').src=GEBID('icoExec').src;GEBID('MemIndent').src=GEBID('icoIndent').src;GEBID('MemResize').src=GEBID('icoResize').src;GEBID('MemSave').src=GEBID('icoSave').src;GEBID('MemLoad').src=GEBID('icoLoad').src;}
  function FS(_name){this.name=_name;this.content=new Array();this.CreateFS=function(tab){var MonFS=[];for(var i=0;i<tab.length;i++){var p=tab[i];var pos=(' '+p).indexOf('/');if(pos>0){dirname=p.substr(0,pos-1);basename=p.substr(pos);if(MonFS[dirname]==undefined)MonFS[dirname]=[];MonFS[dirname].push(basename);}else this.content.push(p);}
  for(p in MonFS){var f=new FS(p);f.CreateFS(MonFS[p]);this.content.push(f);}}
  this.Print=function(dec,dec2){var res='';for(p in this.content){if(typeof(this.content[p])=='string'){res+=dec2+this.content[p]+'\n';}else{res+=this.content[p].name+'\n'+this.content[p].Print(dec+'   ',dec2+this.content[p].name+'/');}}
  return res;}
  this.PrintPretty=function(dec,dec2){var res='';for(p in this.content){if(typeof(this.content[p])=='string'){if(this.content[p].length>0){res+='<option value="'+dec2+this.content[p]+'">'+dec+this.content[p]+'</option>\n';}}else{res+='<optgroup label="'+dec+this.content[p].name+'">\n'+this.content[p].PrintPretty(dec+'&nbsp;&nbsp;',dec2+this.content[p].name+'/')+'</optgroup>';}}
  return res+'';}}
  function UpdateFS(){var tab=directory().split('\n').sort();var monFS=new FS('/');monFS.CreateFS(tab);GEBID('internalFS').innerHTML=monFS.PrintPretty('','');GEBID('internalFS_standalone').innerHTML=GEBID('internalFS').innerHTML;delete monFS;}
  function readExternal(fichier,dest){var fr=new FileReader();switch(dest){case 1:fr.onload=function(e){editor.setValue(e.target.result);GEBID('lecode').value=editor.getValue();}
  break;case 2:fr.onload=function(e){setEntreetexte(e.target.result);}
  break;case 3:fr.onload=function(e){readAllFS(e.target.result);}
  break;}
  fr.readAsText(fichier.files[0]);}
  function monbasename(ch,ext){var tab=ch.split('/');var res=tab[tab.length-1];if(res.lastIndexOf(ext)>0)res=res.substr(0,res.lastIndexOf(ext));return res;}
  function readDataToIFS(fichier){var fr=new FileReader();fr.onload=function(e){writeFile('Data/'+monbasename(fichier.files[0].name,''),e.target.result);}
  fr.readAsDataURL(fichier.files[0]);}
  function fonctionerreur(e,f,l){if(e.indexOf('container only has')>0||e.indexOf('Script error')>=0||e.indexOf('CannotFind')>=0){console.log('Erreur TogetherJS : '+e);}else{if(l<2000){alert('Erreur ligne '+l+'\n'+e);}else{alert('Erreur\n'+e);}}}
  function GEBID(e){var res;try{res=document.getElementById(e);}catch(error){Ecrire("Affichage = "+e);}
  return res;}
  function EcrireAssert(ch){console.log(ch);}
  function Assert(condition,description){if(condition)description='PASS:'+description;else description='FAIL:'+description;EcrireAssert('WARNING ON ASSERT: '+description);}
  function EncodeWithCesar(ch,cle){var res='';for(var i=0;i<Longueur(ch);i++){if((Caractere_vers_Ascii(ch[i])<122)&&(Caractere_vers_Ascii(ch[i])>=32))
  res+=Ascii_vers_Caractere(32+((Caractere_vers_Ascii(ch[i])-32)+cle)%90);else res+=ch[i];}
  return res;}
  function DecodeWithCesar(ch,cle){return EncodeWithCesar(ch,90-cle);}
  function MaskCode(ch){return EncodeWithCesar(ch,29);}
  function UnMaskCode(ch){return DecodeWithCesar(ch,29);}
  var getString=Saisie;var getInt=SaisieEntier;var getReal=SaisieReel;var toInt=enEntier;var toReal=enReel;var toString=enChaine;var Write=Ecrire;var Print=Afficher_srl;var Write=Ecrire;var ClearScreen=EffacerEcran;var InitializeGraphics=Initialiser;var Turtle_go=Avancer;var Turtle_right=Droite;var Turtle_left=Gauche;var Turtle_up=Lever;var Turtle_down=Baisser;var Turtle_move=Deplacer;var Turtle_color=Couleur;var Line=Ligne;var FilledRectangle=RectanglePlein;var Circle=Cercle;var FilledCircle=CerclePlein;var FilledEllipse=EllipsePlein;var Text=Texte;var Polygon=Polygone;var FilledPolygon=PolygonePlein;var LinearGradient=GradientLineaire;var Length=Longueur;var Substr=SousChaine;var Search=PositionDans;var toAscii=Caractere_vers_Ascii;var fromAscii=Ascii_vers_Caractere;var Uppercase=Majuscule;var Size=Taille;var PrintTable=AfficherTableau;var DrawTable=AfficherCourbe;var InitTable=InitialiserTableau;var ConcatTable=ConcateneTableaux;var CombineTableByRow=CombineTableauxL;var CombineTableByColumn=CombineTableauxC;var Reverse=Renverser;var SortNumericalOrder=OrdreNumerique;var SortLexicographicOrder=OrdreLexicographique;var SubTable=SousTableau;var LoadAudio=ChargerSon;var CreateAudio=CreerSon;var CreateAudio16bits=CreerSon16bits;var ImportAudio=ImportSon;var SaveAudio=SauverSon;var ExportAudio=ExportSon;var ExportAudio16bits=ExportSon16bits;var Random=Hasard;var ExecutionTime=chronometre;var getTextEntry=getEntreetexte;var setTextEntry=setEntreetexte;var isInFullScreenMode=false;function launchIntoFullscreen(element){if(element.requestFullscreen){element.requestFullscreen();}else if(element.mozRequestFullScreen){element.mozRequestFullScreen();}else if(element.webkitRequestFullscreen){element.webkitRequestFullscreen();}else if(element.msRequestFullscreen){element.msRequestFullscreen();}}
  function enterFullscreen(){isInFullScreenMode=true;launchIntoFullscreen(document.documentElement);}
  function exitFullscreen(){isInFullScreenMode=false;if(document.exitFullscreen){document.exitFullscreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}}