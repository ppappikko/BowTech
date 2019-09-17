
var param = location.href.split('?')[1],
    board_no = param.split('=')[1],
    comment_no = 0,
    passwordSwitch = 0,
    pageNo = 1,
    pageSize = 5,
    totalPage = 0,
    bottomLimit = 5,
    startPage = 0,
    endPage = 0,
    commentList = $('#comment-list > ul'),
    cmtTemplateSrc = $('#cmt-template').html(),
    cmtReplyTemplateSrc = $('#cmt-reply-template').html();

var cmtGenerator = Handlebars.compile(cmtTemplateSrc),
    cmtReplyGenerator = Handlebars.compile(cmtReplyTemplateSrc);

// 목록 버튼 클릭이벤트
$("#back-btn").click((e) => {
  window.location.href = '.';
});

// 업데이트 버튼 클릭 이벤트
$('#update-btn').click((e) => {
  e.preventDefault();
  $('#passwordModal').modal('show');
  passwordSwitch = 1; // 업데이트
});

// 삭제 버튼 클릭 이벤트
$('#delete-btn').click(() => {
  $('#passwordModal').modal('show');
  passwordSwitch = 2; // 삭제
});

//이전, 다음 버튼 클릭 이벤트
$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadCommentList(board_no, startPage - 1);
});
$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadCommentList(board_no, endPage + 1);
});

// 처음, 마지막 버튼 클릭 이벤트
$('#firstPage > a').click((e) => {
  e.preventDefault();
  loadCommentList(board_no, 1);
});
$('#lastPage > a').click((e) => {
  e.preventDefault();
  loadCommentList(board_no, totalPage);
});

// 데이터 로딩 함수 호출
loadData(board_no, pageNo);
loadCommentList(board_no, pageNo);

// getJson 방식 데이터 로딩 함수 정의
function loadData(no) {
  
  $.getJSON('../../bowtech/app/board/detail?no=' + no, 
      function(obj) {
        
        if (obj.status == 'fail') {
          alert('오류 발생!');
          window.history.back();
        }
        
        var board = obj.board;
        
        var date = board.createdDate.substring(0,10),
            time = board.createdDate.substring(11,19);
        
        $('#board-title').val(board.title);
        $('#board-user').val(board.user);
        $('#board-viewCount').val(board.viewCount);
        $('#board-createdDate').val(date + ' ' + time);
        
        // 내용물 특수문자 처리
        board.contents = board.contents
        .replace(/\&/g,'&amp;').replace(/\</g, '&lt;')
        .replace(/(?:\r\n|\r|\n)/g,'<br/>').replace(/' '/g,'&nbsp;');
        $('#board-contents').html(board.contents);
        
      }); // getJSON()
  
} // loadData()


// JSON 형식의 댓글 목록 가져오기
function loadCommentList(boardNo, pn) {
  
  $.getJSON('../../bowtech/app/comment/list?boardNo=' + boardNo + '&pageNo=' + pn + '&pageSize=' + pageSize, 
    function(obj) {
      
        commentList.empty(); // 이전에 출력한 댓글을 제거한다.
  
        if (obj.status == 'fail') {
          console.log(obj.message);
          $('#firstPage').hide();
          $('#prevPage').hide();
          $('#nextPage').hide();
          $('#lastPage').hide();
          
          return false;
        }
        var comment = obj;
        
        console.log(comment);
        
        // row의 날짜 가공
        comment.parentList.forEach(function(item){
          item.createdDate =
            item.createdDate.substring(0,10) + " " + item.createdDate.substring(11,19);
        });
        comment.childrenList.forEach(function(item){
          item.createdDate =
            item.createdDate.substring(0,10) + " " + item.createdDate.substring(11,19);
        });
        
        // 템플릿 엔진을 실행하여 댓글 생성
        $(cmtGenerator(comment)).appendTo(commentList);
        
        var cmtReplyList,
            childrenList,
            cmtReply;
        
        comment.parentList.forEach(function(item){
          
          cmtReplyList = $('#collapse-' + item.no + ' > ul');
          childrenList = new Array();
          
          comment.childrenList.forEach(function(item2){
            if (item.no == item2.parentNo) {
              childrenList.push(item2);
            }
          });
          
          cmtReply = {childrenList : childrenList};
          $(cmtReplyGenerator(cmtReply)).appendTo(cmtReplyList);
        });
        
        
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
      $(document.body).trigger('loaded-commentList');
      
    }); // getJSON()
  
} // loadCommentList()

$(document.body).bind('loaded-commentList', () => {
  
  // 페이징 목록을 만들어 주는 함수
  pageGenerator();
  
  // 대댓글 버튼 클릭 이벤트 등록 함수
  ReplyAddClick();
  
  // 대댓글 이벤트 처리
  // 작성자
  // blur 이벤트
  $('.reply-user').blur(function() {
    var userExp = /^[가-힣|a-z|A-Z|0-9|\*]+$/;
                
    if ($(this).val().length > 0) {
      if (!userExp.test($(this).val())) {
        alert('한글, 영어, 숫자만 입력이 가능합니다.');
        $(this).val('').focus();
      }
    }
  });
  // keyup 이벤트
  $('.reply-user').keyup(function() {
    if ($(this).val().length > $(this).attr('maxlength')) {
      userLength($(this));
    }
  });
  
  // 비밀번호
  // keyup 이벤트 (한글 입력 안되게 처리)
  $(".reply-password").blur(function() {
    var obj = $(this);
    if (!checkPassword(obj.val())) {
      alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
      setTimeout(function() {
        obj.focus();
      }, 10);
    }
  });

  // 내용
  // blur & keyup 이벤트
  $('.reply-contents').blur(function() {
    contentsLength($(this));
  }).keyup(function() {
    contentsLength($(this));
  });

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
    loadCommentList(board_no, $(e.target).attr('data-no'));
  });
  
});

// 댓글 등록 버튼 클릭이벤트
$('#comment-btn').click((e) => {
  
  var boardNo = board_no,
      user = $('#comment-user').val(),
      password = $('#comment-password').val(),
      contents = $('#comment-contents').val();
  
  if (user.length < 1) {
    alert('작성자 명을 입력하세요.');
    $('#comment-user').focus();
    return false;
    
  } else if (password.length < 1) {
    alert('비밀번호를 입력하세요.');
    $('#comment-password').focus();
    return false;
    
  } else if (contents.length < 1 ||
      contents.trim().length == 0) {
    alert('내용을 입력하세요.');
    $('#comment-contents').val('');
    $('#comment-contents').focus();
    return false;
  }
  
  if (!checkPassword(password)) {
    alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
    setTimeout(function() {
      $("#comment-password").focus();
    }, 10);
    return false;
  }
  
  if (contents.length > 200) {
    contentsLength($('#comment-contents'));
    return false;
  }
  
  $.ajax({
    url:'../../bowtech/app/comment/add',
    type: 'post',
    data: "boardNo=" + boardNo +
    "&user=" + encodeURIComponent(user) +
    "&password=" + encodeURIComponent(password) +
    "&contents=" + encodeURIComponent(contents),
    contentType: "application/x-www-form-urlencoded",
    success: function(data) {
      if (data.status == 'success') {
        // 입력 폼 초기화 및 댓글 리스트 재출력
        $('.write-comment').find('input').val('');
        $('.write-comment').find('textarea').val('');
        $('.count-num').html('0');
        loadCommentList(boardNo, 1);
      } else {
        alert('등록 실패!' + data.message);
      }
    },
    error: function() {
      alert('등록 실패!');
    }
  });

});

// 대댓글 등록 버튼 클릭이벤트
function ReplyAddClick() {
  // 댓글 삭제 버튼 클릭 이벤트
  $('.cmt-delete-btn').click((e) => {
    $('#passwordModal').modal('show');
    comment_no = $(e.target).attr('data-no');
    passwordSwitch = 3; // 댓글 삭제
  });
  
  $('.reply-btn').click((e) => {
    e.preventDefault();
    
    var boardNo = board_no,
        parentNo = $(e.target).attr('data-no');
        user = $('#reply-write-' + parentNo + ' input[name="user"]').val(),
        password = $('#reply-write-' + parentNo + ' input[name="password"]').val(),
        contents = $('#reply-write-' + parentNo + ' textarea[name="contents"]').val();
        
    if (user.length < 1) {
      alert('작성자 명을 입력하세요.');
      $('#reply-write-' + parentNo + ' input[name="user"]').focus();
      return false;
      
    } else if (password.length < 1) {
      alert('비밀번호를 입력하세요.');
      $('#reply-write-' + parentNo + ' input[name="password"]').focus();
      return false;
      
    } else if (contents.length < 1 ||
        contents.trim().length == 0) {
      alert('내용을 입력하세요.');
      $('#reply-write-' + parentNo + ' textarea[name="contents"]').val('');
      $('#reply-write-' + parentNo + ' textarea[name="contents"]').focus();
      return false;
    }
    
    if (!checkPassword(password)) {
      alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
      setTimeout(function() {
        $('#reply-write-' + parentNo + ' input[name="password"]').focus();
      }, 10);
      return false;
    }
    
    if (contents.length > 200) {
      contentsLength($('#reply-write-' + parentNo + ' textarea[name="contents"]'));
      return false;
    }
    
    $.ajax({
      url:'../../bowtech/app/comment/add',
      type: 'post',
      data: "boardNo=" + boardNo +
      "&parentNo=" + parentNo +
      "&user=" + encodeURIComponent(user) +
      "&password=" + encodeURIComponent(password) +
      "&contents=" + encodeURIComponent(contents),
      contentType: "application/x-www-form-urlencoded",
      success: function(data) {
        if (data.status == 'success') {
          // 입력 폼 초기화 및 댓글 리스트 재출력
          $('#reply-write-' + parentNo).find('input').val('');
          $('#reply-write-' + parentNo).find('textarea').val('');
          $('#reply-write-' + parentNo).find('.reply-count-num').html('0');
          loadCommentList(boardNo, 1);
        } else {
          alert('등록 실패!' + data.message);
        }
      },
      error: function() {
        alert('등록 실패!');
      }
    });
  
  });
}

// 변경, 삭제
// password 입력 후 확인 버튼
$('#confirm-btn').click(() => {
  passwordConfirm();
});

// modal 닫힐 때 내용 삭제 열릴 때 포커스
$('#passwordModal').on('hidden.bs.modal', () => {
  $('#password-confirm').val('');
  
}).on('shown.bs.modal', () => {
  $('#password-confirm').focus();
});

// 게시글 삭제 함수
function boardDelete() {
  $.getJSON('../../bowtech/app/board/delete?no=' + board_no, 
      function(obj) {
    
    if (obj.status == 'success') {
      window.location.href = '.';
    } else {
      alert('삭제 실패!');
    }
  }); // getJSON()
}

// 댓글 삭제 함수
function commentDelete() {
  $.getJSON('../../bowtech/app/comment/delete?no=' + comment_no, 
      function(obj) {
    
    if (obj.status == 'success') {
      loadCommentList(board_no, 1);
      $('#passwordModal').modal('hide');
    } else {
      alert('삭제 실패!');
    }
  }); // getJSON()
}

// 비밀번호 엔터 이벤트
$("#password-confirm").keydown(function(key) {
  if (key.which == 13) {
    passwordConfirm();
  }
});

// 비밀번호 확인 함수
function passwordConfirm() {
  
  var password = $('#password-confirm').val();
  
  if (password.length == 0 || password == undefined) {
    alert('비밀번호를 입력하세요!');
    $('#password-confirm').focus();
    return false;
  }
  
  // 댓글의 삭제 버튼 클릭 시
  if (passwordSwitch == 3) {
    
    $.ajax({
      async: true,
      type : 'POST',
      data : {no : comment_no, password : password},
      url : "../../bowtech/app/comment/passwordcheck",
      success : function(data) {
        if (!data.result){
          alert('비밀번호가 틀렸습니다!');
          $('#password-confirm').focus();
          return false;
        }
        
        if (!confirm('정말 삭제 하시겠습니까?')) {
          return false;
        } else {
          passwordSwitch = 0;
          commentDelete();
        }
      },
      error : function(error) {
        alert('오류 발생!');
        return false;
      }
    });
  } else {
    
    $.ajax({
      async: true,
      type : 'POST',
      data : {no : board_no, password : password},
      url : "../../bowtech/app/board/passwordcheck",
      success : function(data) {
        if (!data.result){
          alert('비밀번호가 틀렸습니다!');
          $('#password-confirm').focus();
          return false;
        }
        
        if (passwordSwitch == 1) {
          passwordSwitch = 0;
          window.location.href = 'form.html?no=' + board_no;
          
        } else if (passwordSwitch == 2) {
          if (!confirm('정말 삭제 하시겠습니까?')) {
            return false;
          } else {
            passwordSwitch = 0;
            boardDelete();
          }
        }
      },
      error : function(error) {
        alert('오류 발생!');
        return false;
      }
    });
  }
  
}

// 작성자
// blur 이벤트
$('#comment-user').blur(function() {
  var userExp = /^[가-힣|a-z|A-Z|0-9|\*]+$/;
               
  if ($(this).val().length > 0) {
   if (!userExp.test($(this).val())) {
     alert('한글, 영어, 숫자만 입력이 가능합니다.');
     $(this).val('').focus();
   }
  }
});
// keyup 이벤트
$('#comment-user').keyup(function() {
  if ($(this).val().length > $(this).attr('maxlength')) {
   userLength($(this));
  }
});
// 글자 수 제한 함수
function userLength(obj) {
  alert('작성자 명은 6자까지 입력할 수 있습니다.');
  user = obj.val(obj.val().substring(0,6));
  obj.focus();
}

// 비밀번호
// keyup 이벤트 (한글 입력 안되게 처리)
$("#comment-password").blur(function() {
  var obj = $(this);
  if (!checkPassword(obj.val())) {
   alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
   setTimeout(function() {
     obj.focus();
   }, 10);
  }
});

// 내용
// blur & keyup 이벤트
$('#comment-contents').blur(function() {
  contentsLength($(this));
}).keyup(function() {
  contentsLength($(this));
});
// 글자 수 제한 함수
function contentsLength(obj) {
  obj.parents('.row').next().find('.count-num').html(obj.val().length);
  if (obj.val().length > 200) {
   alert('내용은 200자까지 입력할 수 있습니다.');
   contents = obj.val(obj.val().substring(0,200));
   obj.parents('.row').next().find('.count-num').html(200);
   obj.focus();
  }
}

// 비밀번호 정규표현식
function checkPassword(password){
  
  if (password.length < 1) {
    return true;
  }
  
  if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,25}$/.test(password)){
    return false;
  }    
  var checkNumber = password.search(/[0-9]/g);
  var checkEnglish = password.search(/[a-z]/ig);
  if(checkNumber <0 || checkEnglish <0){
    return false;
  }
  if(/(\w)\1\1\1/.test(password)){
    return false;
  }
  return true;
}


