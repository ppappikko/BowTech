package com.shp.board.domain;
import java.io.Serializable;
import java.sql.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

public class Comment implements Cloneable, Serializable {
  private static final long serialVersionUID = 1L;

  private int no;
  private int boardNo;
  private int parentNo;
  private int groupOrd;
  private int depth;
  private String contents;
  
  @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private Date createdDate;
  @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private Date updateDate;
  
  private String user;
  private String password;
  private int replyCount;
  
  @Override
  public Comment clone() throws CloneNotSupportedException {
    return (Comment) super.clone();
  }

  @Override
  public String toString() {
    return "Comment [no=" + no + ", boardNo=" + boardNo + ", parentNo=" + parentNo + ", groupOrd="
        + groupOrd + ", depth=" + depth + ", contents=" + contents + ", createdDate=" + createdDate
        + ", updateDate=" + updateDate + ", user=" + user + ", password=" + password
        + ", replyCount=" + replyCount + "]";
  }

  public int getNo() {
    return no;
  }

  public void setNo(int no) {
    this.no = no;
  }
  
  public int getBoardNo() {
    return boardNo;
  }

  public void setBoardNo(int boardNo) {
    this.boardNo = boardNo;
  }

  public int getParentNo() {
    return parentNo;
  }
  
  public void setParentNo(int parentNo) {
    this.parentNo = parentNo;
  }
  
  public int getGroupOrd() {
    return groupOrd;
  }
  
  public void setGroupOrd(int groupOrd) {
    this.groupOrd = groupOrd;
  }
  
  public int getDepth() {
    return depth;
  }
  
  public void setDepth(int depth) {
    this.depth = depth;
  }

  public String getContents() {
    return contents;
  }

  public void setContents(String contents) {
    this.contents = contents;
  }

  public Date getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Date createdDate) {
    this.createdDate = createdDate;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public int getReplyCount() {
    return replyCount;
  }

  public void setReplyCount(int replyCount) {
    this.replyCount = replyCount;
  }
  
}
