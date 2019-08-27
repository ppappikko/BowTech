package com.shp.board.domain;
import java.io.Serializable;
import java.sql.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

public class Board implements Cloneable, Serializable {
  private static final long serialVersionUID = 1L;

  private int no;
  private String title;
  private String contents;
  
  @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd", timezone="Asia/Seoul")
  private Date createdDate;
  @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd", timezone="Asia/Seoul")
  private Date updateDate;
  
  private int viewCount;
  private String user;
  private String password;
  private int commentCount;
  private int atachedFileCount;
  private boolean isDelete;
  
  @Override
  public Board clone() throws CloneNotSupportedException {
    return (Board) super.clone();
  }

  
  @Override
  public String toString() {
    return "Board [no=" + no + ", title=" + title + ", contents=" + contents + ", createdDate="
        + createdDate + ", updateDate=" + updateDate + ", viewCount=" + viewCount + ", user=" + user
        + ", password=" + password + ", commentCount=" + commentCount + ", atachedFileCount="
        + atachedFileCount + ", isDelete=" + isDelete + "]";
  }

  public int getNo() {
    return no;
  }

  public void setNo(int no) {
    this.no = no;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public int getViewCount() {
    return viewCount;
  }

  public void setViewCount(int viewCount) {
    this.viewCount = viewCount;
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

  public int getCommentCount() {
    return commentCount;
  }

  public void setCommentCount(int commentCount) {
    this.commentCount = commentCount;
  }

  public int getAtachedFileCount() {
    return atachedFileCount;
  }

  public void setAtachedFileCount(int atachedFileCount) {
    this.atachedFileCount = atachedFileCount;
  }

  public boolean isDelete() {
    return isDelete;
  }

  public void setDelete(boolean isDelete) {
    this.isDelete = isDelete;
  }
  
}
