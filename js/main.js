console.log('Starting up')
$(document).ready(init)
function init() {
    renderProjs()
}


function renderProjs() {
    var projs = getProjs()
    var strCoverHtml = ''
    var strModalHtml = ''
    projs.map((proj, idx) => {
        strCoverHtml += `<div class="col-md-4 col-sm-6 portfolio-item">
     <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${idx + 1}">
     <div class="portfolio-hover">
     <div class="portfolio-hover-content">
     <i class="fa fa-plus fa-3x"></i>
     </div>
     </div>
     <img class="img-fluid" src="img/portfolio/${proj.id}.jpg">
     </a>
     <div class="portfolio-caption">
     <h4>${proj.name}</h4>
     <p class="text-muted">${proj.title}</p>
     </div>
    </div>`

        strModalHtml += ` <div class="portfolio-modal modal fade" id="portfolioModal${idx + 1}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="close-modal" data-dismiss="modal">
          <div class="lr">
            <div class="rl"></div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="modal-body">
                <!-- Project Details Go Here -->
                <h2>${proj.name}</h2>
                <p class="item-intro text-muted">${proj.title}</p>
                <div class="img-btn" onclick="openProj('${proj.name}')">
                <img class="img-fluid modal-img d-block mx-auto" src="img/portfolio/${proj.id}.jpg" alt="">
                </div>
                <p>${proj.desc}
                 </p>
                <ul class="list-inline">
                  <li>Built in: ${proj.publishedAt}</li>
                  <li>Category: ${proj.category}</li>
                </ul>
                <button class="btn btn-primary" onclick="openProj(${proj.name})" type="button">
                 Play Game</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
    })
    $('.portfolios-container').prepend(strCoverHtml)
    $('.modal-container').prepend(strModalHtml)
}

function openProj(projName) {
    window.location.href = `projs/${projName}/index.html`
}

function onSubmit(event) {
    var mailAddress = $('.email-address').val()
    var subjectStr = $('.form-subject').val()
    var messageText = $('.message-text').val()
    if (!subjectStr || !mailAddress) return
    window.open(`https://mail.google.com/mail/
    ?view=cm&fs=1&to=${mailAddress}&su=${subjectStr}&body=${messageText}`)
}
