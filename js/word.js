var jpd;
var curJpd;
var _hg = 1;
var _ch = 1;
var _base = 1;
var _idx;
var _type = -1;
var _page = 1;
var SIZE = 36;
var _SEARCH_STATUS = 0;
var _SEARCH_CNT;
var COUNT;

$(init);

function init() {
  promiseDataTmpl('/tmpl/cardword.tmpl','/getWord',MASK, function(r,e){
    renderCard(r,e)
  })
  
  initSwipe();
}

function initSwipe() {
  var mq = document.querySelector('.m-search');
  var mqs = new Hammer.Manager(mq);
  mqs.add(new Hammer.Swipe());
  mqs.get('swipe');
  // mqs.on('swipe', function(e) { })


  var ms = document.querySelector('.m-nav');
  var mgs = new Hammer.Manager(ms);
  mgs.add(new Hammer.Swipe());
  mgs.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
  mgs.on('swipe', function(e) {
    if ((e.offsetDirection === 4)||(e.offsetDirection === 2)) {
      $('.m-search').css('display','flex')
      $('.m-search-cnt').val('').focus()
    }
  })

  var mDetail = document.querySelector('.m-detail');
  var mgDetail = new Hammer.Manager(mDetail);
  mgDetail.add(new Hammer.Swipe());
  mgDetail.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

  mgDetail.on('swipe', function(e) {
    if (e.offsetDirection === 4) {
      // _idx--;
      for(var i=0;i<curJpd.list.length;i++) {
        if ((curJpd.list[i].idx == _idx)&&(i>0)) {

          _idx = curJpd.list[i-1].idx
           break;
        }
      }
      renderDetail();
    }else if(  e.offsetDirection === 2 ) {
      for(var i=0;i<curJpd.list.length;i++) {
        if ((curJpd.list[i].idx == _idx)&&(i<curJpd.list.length-1)) {
          _idx = curJpd.list[i+1].idx
          break;
        }
      }
      // _idx++;
      renderDetail();
    }
  })

  var mMain = document.querySelector('.m-main');
  var mgMain = new Hammer.Manager(mMain);
  mgMain.add(new Hammer.Swipe());
  mgMain.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
  mgMain.on('swipe', function(e) {
    if (e.offsetDirection === 4) {
      if (_page===1) return;
      _page --
      var showFrom = SIZE * (_page - 1);
      var showTo = showFrom + SIZE;
      $('.m-card').hide().slice(showFrom, showTo).show();
      $('#card-pagination').pagination('prevPage');
    }else if(  e.offsetDirection === 2 ) {
      var maxPage = Math.ceil(COUNT/SIZE)
      if (_page === maxPage ) return;
      _page ++
      var showFrom = SIZE * (_page - 1);
      var showTo = showFrom + SIZE;
      $('.m-card').hide().slice(showFrom, showTo).show();
      $('#card-pagination').pagination('nextPage');
    }
  })
}

function renderCard(r,data) {
  _page = 1;

  for(var i=0;i<data.list.length;i++) {
     data.list[i].idx = i;
  }
  jpd = data;
  e = { 'list':[] }

  if (_SEARCH_STATUS == 0) { //分类过滤
    if (_type !== -1) {
      for(var i=0;i<data.list.length;i++) {
        if(parseInt(data.list[i].ln) === _type) {
          e.list.push(data.list[i])
        }
      }
    }else{
      e = data;
    }
  }else if(_SEARCH_STATUS == 1){ //查询数据
    
    for(var i=0;i<data.list.length;i++) {
      console.log(data.list[i].base + ' - ' + data.list[i].chinese)
      if ((data.list[i].base.indexOf(_SEARCH_CNT)>=0) || (data.list[i].hiragana.indexOf(_SEARCH_CNT)>=0) || (data.list[i].chinese.indexOf(_SEARCH_CNT)>=0) ) {
        e.list.push(data.list[i])
      }
    }

    for(var i=0;i<data.list.length;i++) {
      var hg = data.list[i].hiragana;

      //汉字检索
      if (!(hg instanceof Array)) {
        // hg = hg.replace(/\-/g,"");
        hgList = hg.split('\\');
      }else{
        hgList = hg;
      }
      
      //假名检索
      for(var j=0;j<hgList.length;j++) {
        if(hgList[j].replace(/\-/g,"") === _SEARCH_CNT) {
          e.list.push(data.list[i])
        }
      }
    }

    handleCloseSearch();
  }
  
  curJpd = e;
  $('.m-main').empty()
  $('.m-main').append($.templates(r).render(e, rdHelper));
  $('.m-card').off('click').on('click', handleDetail);
  $('.m-showHG').off('click').on('click', handleShowHG);
  $('.m-close').off('click').on('click', handleClose);
  $('.m-showCH').off('click').on('click', handleShowCH);
  $('.m-showJP').off('click').on('click', handleShowJP);
  $('.m-status').off('click').on('click', handleStatus);
  $('.m-filter').off('click').on('click', handleFilter);
  $('.m-search-cancel').off('click').on('click', handleCloseSearch);
  $('.m-search-ok').off('click').on('click', handleDoSearch);
  $('body').animate({scrollTop: '0px'}, 0)
  
  COUNT = e.list.length;
  if (COUNT > SIZE) {
    var items = $('.m-card');
    items.slice(SIZE).hide();
    $('#card-pagination').pagination({
      items: COUNT,
      itemsOnPage: SIZE,
      edges: 1,
      displayedPages:4,
      prevText: '&laquo;',
      nextText: '&raquo;',
      hrefTextPrefix: '#',
      onPageClick: function (pageNumber) {
        var showFrom = SIZE * (pageNumber - 1);
        var showTo = showFrom + SIZE;
        _page = pageNumber;
        console.log(_page)
        items.hide().slice(showFrom, showTo).show();
      }
    });
  }
}


 function handleShowHG() {
    if (_hg===1) {
      $('.m-hg').css('visibility','hidden');
      _hg = 0;
    }else{
      $('.m-hg').css('visibility','visible');
      _hg = 1;
    }
  }


 function handleShowCH() {
    if (_ch===1) {
      $('.m-chi').css('visibility','hidden');
      _ch = 0;
    }else{
      $('.m-chi').css('visibility','visible');
      _ch = 1;
    }
  }

function handleShowJP() {
    if (_base===1) {
      $('.m-base').css('visibility','hidden');
      _base = 0;
    }else{
      $('.m-base').css('visibility','visible');
      _base = 1;
    }
  }

function renderDetail() {
  // let da;
  for(var i=0;i<curJpd.list.length;i++) {
    if (curJpd.list[i].idx == _idx) {
      da = curJpd.list[i]
    }
  }
  // da = curJpd.list[_idx]
  $('.m-detail').empty()
  $('.m-detail').append($('#detailTmpl').render(da, rdHelper));
  $('.m-card').off('click').on('click', handleDetail);
  $('.m-showHG').off('click').on('click', handleShowHG);
  $('.m-close').off('click').on('click', handleClose);
  $('.m-showCH').off('click').on('click', handleShowCH);
  $('.m-status').off('click').on('click', handleStatus);
  $('.m-filter').off('click').on('click', handleFilter);
  $('.m-detail').show();
  (_hg===1)?$('.m-hg').css('visibility','visible'):$('.m-hg').css('visibility','hidden');
  (_ch===1)?$('.m-chi').css('visibility','visible'):$('.m-chi').css('visibility','hidden');
  (_base===1)?$('.m-base').css('visibility','visible'):$('.m-base').css('visibility','hidden');
}

function  handleDetail(e) {
    _idx = $(e.currentTarget).data('index');
    renderDetail();
}
  
function  handleClose(e) {
    $('.m-detail').hide();
}

function  handleStatus(e) {
    type = $(this).data('type');
    data = { 'index': _idx, 'type': type};
    promise('get','/savewordSucc',data,MASK, function(r) {
      $(`.m-card[data-index='${_idx}']`).removeClass('m-type1').removeClass('m-type2').addClass(`m-type${type}`);
      $('.m-bs-wrap').removeClass('m-type1').removeClass('m-type2').addClass(`m-type${type}`);
      jpd.list[_idx].ln = type;
    })
  }

function handleFilter(e) {
  _SEARCH_STATUS=0;
  _type = $(this).data('type');
  promiseDataTmpl('/tmpl/cardword.tmpl','/getWord',MASK, function(r,e){
    renderCard(r,e)
  })
}

function handleCloseSearch() {
  $('.m-search').css('display','none');
  $('body').animate({scrollTop: '0px'}, 0);
}

function handleDoSearch() {
  _SEARCH_STATUS = 1;
  _SEARCH_CNT = $('.m-search-cnt').val();
  promiseDataTmpl('/tmpl/cardword.tmpl','/getWord',MASK, function(r,e){
    renderCard(r,e)
  })
}