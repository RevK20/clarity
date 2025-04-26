UnicornStudio.addScene({
  elementId: "unicorn", // id of the HTML element to render your scene in (the scene will use its dimensions)
  fps: 100, // frames per second (0-120) [optional]
  scale: 1,

  lazyLoad: true, // will not initialize the scene until it scrolls into view
  filePath: "./effect.json",
  interactivity: {
    // [optional]
    mouse: {
      disableMobile: true, // disable touch / scroll movement on mobile
    },
  },
})
  .then((scene) => {
    // scene is ready
    // To remove a scene, you can use:
    // scene.destroy()
  })
  .catch((err) => {
    console.error(err);
  });

  //Blob
var videoContainer = document.querySelector(".section-2");
var blob = document.querySelector("#blob");

videoContainer.addEventListener("mousemove", function (details) {
  blob.style.transform = `translate(${details.clientX * 0.5}px, ${details.clientY * 0.3}px)`
})

//gsap
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)
 
  var part1 = gsap.timeline({
    scrollTrigger:{
      trigger: "#section2-1",
      start:"10% 100%",
      end:"90% 0%",
      scrub: true,
      // markers: true,
      duration: 1,
    }
  });
  part1.to("#top-nav-sec2",{
    backgroundColor: "#fd7024"
  }, 'a')
  .from("#section2-1 h1, #section2-1 p, #section2-1 img",{
    opacity: 0,
    y: -850,
  }, 'a')
  .to("#section2-1 h1, #section2-1 p, #section2-1 img",{
    opacity:0,
    y:850,
  })

  var part2 = gsap.timeline({
    scrollTrigger:{
      trigger: "#section2-2",
      start:"10% 100%",
      end:"90% 0%",
      scrub: true,
      // markers: true,
      duration: 1,
    }
  });
  part2.to("#top-nav-sec2-1",{
    backgroundColor: "#fd7024"
  }, 'b')
  .from("#section2-2 h1, #section2-2 p, #section2-2 img",{
    opacity: 0,
    y: -850,
  }, 'b')
  .to("#section2-2 h1, #section2-2 p, #section2-2 img",{
    opacity:0,
    y:850,
  })


  var part3 = gsap.timeline({
    scrollTrigger:{
      trigger: "#section2-3",
      start:"10% 100%",
      end:"90% 0%",
      scrub: true,
      // markers: true,
      duration: 1,
    }
  });
  part3.to("#top-nav-sec2-2",{
    backgroundColor: "#fd7024"
  }, 'c')
  .from("#section2-3 h1, #section2-3 p, #section2-3 img",{
    opacity: 0,
    y: -850,
  }, 'c')
  .to("#section2-3 h1, #section2-3 p, #section2-3 img",{
    opacity:0,
    y:850,
  })


  var part4 = gsap.timeline({
    scrollTrigger:{
      trigger: "#section2-4",
      start:"10% 100%",
      end:"90% 0%",
      scrub: true,
      // markers: true,
      duration: 1,
    }
  });
  part4.to("#top-nav-sec2-3",{
    backgroundColor: "#fd7024"
  }, 'c')
  .from("#section2-4 h1, #section2-4 p, #section2-4 img",{
    opacity: 0,
    y: -850,
  }, 'c')
  .to("#section2-4 h1, #section2-4 p, #section2-4 img",{
    opacity:0,
    y:850,
  })


 });

var section3=document.querySelector(".section3");
 var s3value=document.querySelectorAll(".svalue");
 section3.addEventListener("mousemove",function(deta){
  s3value.forEach((elem)=>{
    const position=elem.getAttribute("value");

    var x=(window.innerWidth-deta.clientX*position)/50;
    var y=(window.innerHeight-deta.clientY*position)/50;
    elem.style.transform=`translateX(${x}px) translateY(${y}px)`
  })
 })


 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)
 var part5 = gsap.timeline({
  scrollTrigger:{
    trigger: ".section3",
    start:"50% 100%",
    end:"50% 40%",
    scrub: true,
    //markers: true,
    duration: 1,
  }
});
part5.from(".pract-lft-section3,.your-lft-section3,#arrow,.svalue",{
  y: "200"
}, 'd')
.to("#star1,#star2",{
  width: "5vw"
}, 'd')

.to("#star2",{
  marginRight:"1vw",
},'d')
});

const container = document.querySelector(".container");
const sections = gsap.utils.toArray(".container section");
const texts = gsap.utils.toArray(".anim");
const mask = document.querySelector(".mask");

let scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    end: "+=3000",
    //snap: 1 / (sections.length - 1),
    //markers: true,
  }
});

console.log(1 / (sections.length - 1))

//Progress bar animation

gsap.to(mask, {
  width: "100%",
  scrollTrigger: {
    trigger: ".wrapper",
    start: "top left",
    scrub: 1
  }
});

// whizz around the sections
sections.forEach((section) => {
  // grab the scoped text
  let text = section.querySelectorAll(".anim");
  
  // bump out if there's no items to animate
  if(text.length === 0)  return 
  
  // do a little stagger
  gsap.from(text, {
    y: -130,
    opacity: 0,
    duration: 2,
    ease: "elastic",
    stagger: 0.1,
    scrollTrigger: {
      trigger: section,
      containerAnimation: scrollTween,
      start: "left center",
      //markers: true
    }
  });
});