var pageNo = 1,
    pageSize = 10,
    totalPage = 0,
    bottomLimit = 10,
    startPage = 0,
    endPage = 0,
    keyword = '',
    tbody = $('tbody'),
    prevPageLi = $('#prevPage'),
    nextPageLi = $('#nextPage'),
    currSpan = $('#currPage > span'),
    templateSrc = $('#tr-template').html(); // script 태그에서 템플릿 데이터를 꺼낸다.

//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var trGenerator = Handlebars.compile(templateSrc);


// JSON 형식의 데이터 목록 가져오기
function loadList(pn) {
  
  $.getJSON('../../bowtech/app/board/list?pageNo=' + pn + '&pageSize=' + pageSize, 
    function(obj) {
      
      // TR 태그를 생성하여 테이블 데이터를 갱신한다.
      tbody.html(''); // 이전에 출력한 내용을 제거한다.

      var board = obj;
      
      // row의 날짜에서 시간을 뺀다.
      board.list.forEach(function(item){
        item.createdDate = item.createdDate.substring(0,10);
      });
      
      // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 tbody에 붙인다.
      $(trGenerator(board)).appendTo(tbody);
      
      // page 리스트 생성에 필요한 변수
      pageNo = obj.pageNo;
      totalPage = obj.totalPage;
      
      // ex) 현재 페이지가 10 페이지인 경우 1 ~ 10 번호가 보여야 한다.
      // 따라서 시작 번호가 1 이어야 하므로 나눈 후 버림 처리를 한다.
      // 전 블록의 마지막 번호를 구해서 + 1한 값이 현재 블록의 첫번째 번호이다.
      startPage = (Math.floor((pageNo - 1) / bottomLimit)) * bottomLimit + 1;
      endPage = startPage + bottomLimit - 1;
      
      if (totalPage < endPage) {
        endPage = totalPage;
      }
      
      // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
      $(document.body).trigger('loaded-list');
      
    }); // getJSON()
  
} // loadList()

// 검색 버튼 클릭이벤트
$('#search-btn').click(function() {
  searchResult($(this).siblings('input[type="text"]'));
});

// 검색 엔터 이벤트
$("#search-form").children('input[type="text"]').keydown(function(key) {
  if (key.which == 13) {
    searchResult($(this));
  }
});

function searchResult(obj) {
  
  if (obj.val().startsWith(' ') ||
      obj.val().endsWith(' ')) {
    obj.val(obj.val().trim());
  }
  
  if (obj.val().length < 1) {
    alert('키워드를 입력하세요!');
    obj.focus();
    return false;
  }
  pageNo = 1;
  keyword = obj.val();
  window.location.href = 'search.html?keyword=' + keyword;
}

// 이전, 다음 버튼 클릭 이벤트
$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadList(startPage - 1);
});
$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadList(endPage + 1);
});

// 처음, 마지막 버튼 클릭 이벤트
$('#firstPage > a').click((e) => {
  e.preventDefault();
  loadList(1);
});
$('#lastPage > a').click((e) => {
  e.preventDefault();
  loadList(totalPage);
});

// 페이지를 출력한 후 1페이지 목록을 로딩한다.
loadList(pageNo);

// 테이블 목록 가져오기를 완료했으면 제목 a 태그에 클릭 리스너를 등록한다. 
// 페이징 목록을 만들어 준다.
$(document.body).bind('loaded-list', () => {
  // 제목을 클릭했을 때 view.html로 전환시키기
  $('.bow-view-link').click((e) => {
    e.preventDefault();
    window.location.href = 'view.html?no=' + 
      $(e.target).attr('data-no');
  });
  
  // 페이징 목록을 만들어 주는 함수
  pageGenerator();
});

// 페이징 목록을 만들어 주는 함수
function pageGenerator() {
  //  페이지 버튼 초기화
  $('.page-item.page-no-li').remove();
  
  // 페이지 번호 생성
  for (var i = startPage; i <= endPage; i++) {
    $('#pageList').append(
    '<li class="page-item page-no-li">' +
    '<a class="page-link page-no" href="#" data-no="' + i + '">' + i + '</a></li>');
    
    if (pageNo == i) {
      $('a.page-link[data-no='+ i +']').parent().addClass('active');
    }
  }
  
  // 현재 페이지 번호가 1 보다 큰 경우 맨 처음 페이지로 돌아가기 버튼 활성
  if (pageNo <= 1) {
    $('#firstPage').hide();
  } else {
    $('#firstPage').show();
  }
  
  // 처음 페이지 번호가 1보다 크면 이전 버튼 활성
  if (startPage <= 1) {
    $('#prevPage').hide();
  } else {
    $('#prevPage').show();
  }
  
  // bottomLimit의 마지막 페이지 번호가 총 페이지 수 보다 작은 경우 다음 버튼 활성
  if (endPage >= totalPage) {
    $('#nextPage').hide();
  } else {
    $('#nextPage').show();
  }
  
  //  현재 페이지 번호가 마지막 페이지가 아닌 경우 맨 마지막 페이지로 가기 버튼 활성
  if (pageNo >= totalPage) {
    $('#lastPage').hide();
  } else {
    $('#lastPage').show();
  }
  
  $(document.body).trigger('loaded-pages');
}

// 페이징 목록을 만들어 준 후 클릭 이벤트 등록
$(document.body).bind('loaded-pages', () => {
  
  // 페이지 번호 버튼 클릭 이벤트
  $('.page-link.page-no').click((e) => {
    e.preventDefault();
    loadList($(e.target).attr('data-no'));
  });
  
});



