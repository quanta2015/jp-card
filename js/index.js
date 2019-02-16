var jpd;
var _hg = 1;
var _ch = 1;
var _idx;
var _type = -1;

$(init);

function init() {
  promiseDataTmpl('/tmpl/card.tmpl','/getData',MASK, function(r,e){
    renderCard(r,e)
  })
}

function renderCard(r,data) {
  for(var i=0;i<data.list.length;i++) {
     data.list[i].idx = i;
  }
  jpd = data;
  e = { 'list':[] }

  if (_type !== -1) {
    for(var i=0;i<data.list.length;i++) {
      if(parseInt(data.list[i].ln) === _type) {
        e.list.push(data.list[i])
      }
    }
  }else{
    e = data;
  }

  $('.m-main').empty()
  $('.m-main').append($.templates(r).render(e, rdHelper));

  $('.m-card').off('click').on('click', handleDetail);
  $('.m-showHG').off('click').on('click', handleShowHG);
  $('.m-close').off('click').on('click', handleClose);
  $('.m-showCH').off('click').on('click', handleShowCH);
  $('.m-status').off('click').on('click', handleStatus);
  $('.m-filter').off('click').on('click', handleFilter);

  var SIZE = 36;
  var COUNT = e.list.length;
  if (COUNT > SIZE) {
    var items = $('.m-card');
    items.slice(SIZE).hide();
    $('#card-pagination').pagination({
      items: COUNT,
      itemsOnPage: SIZE,
      prevText: '&laquo;',
      nextText: '&raquo;',
      hrefTextPrefix: '#',
      onPageClick: function (pageNumber) {
        var showFrom = SIZE * (pageNumber - 1);
        var showTo = showFrom + SIZE;
        items.hide().slice(showFrom, showTo).show();
      }
    });
  }
}


 function handleShowHG() {
    if (_hg===1) {
      $('.m-hg').css('visibility','hidden');
      // $('.m-showHG').html('显示假名')
      _hg = 0;
    }else{
      // $('.m-showHG').html('隐藏假名')
      $('.m-hg').css('visibility','visible');
      _hg = 1;
    }
  }


 function handleShowCH() {
    if (_ch===1) {
      $('.m-chinese').css('visibility','hidden');
      $('.m-card').removeClass('m-ch')
      _ch = 0;
    }else{
      $('.m-chinese').css('visibility','visible');
      $('.m-card').addClass('m-ch')
      _ch = 1;
    }
  }

function  handleDetail(e) {
    _idx = $(e.currentTarget).data('index')
    da = jpd.list[_idx]
    promiseTmpl('/tmpl/detail.tmpl', function(r){
      $('.m-detail').empty()
      $('.m-detail').append($.templates(r).render(da, rdHelper));
      $('.m-card').off('click').on('click', handleDetail);
      $('.m-showHG').off('click').on('click', handleShowHG);
      $('.m-close').off('click').on('click', handleClose);
      $('.m-showCH').off('click').on('click', handleShowCH);
      $('.m-status').off('click').on('click', handleStatus);
      $('.m-filter').off('click').on('click', handleFilter);
      $('.m-detail').show();
      (_hg===1)?$('.m-hg').css('visibility','visible'):$('.m-hg').css('visibility','hidden');
      (_ch===1)?$('.m-chinese').css('visibility','visible'):$('.m-chinese').css('visibility','hidden');
    })
  }
  
function  handleClose(e) {
    $('.m-detail').hide();
}

function  handleStatus(e) {
    type = $(this).data('type');
    data = { 'index': _idx, 'type': type};
    promise('get','/saveSucc',data,MASK, function(r) {
      $(`.m-card[data-index='${_idx}']`).removeClass('m-type1').removeClass('m-type2').addClass(`m-type${type}`);
    })
  }

function handleFilter(e) {
    _type = $(this).data('type');
    promiseDataTmpl('/tmpl/card.tmpl','/getData',MASK, function(r,e){
      renderCard(r,e)
    })
}
