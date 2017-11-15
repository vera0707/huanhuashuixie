package com.lsx.model;

/*******************************************************************************
 * Copyright (c) 2005-2017 Gozap, Inc.
 * connectPro
 * com.lsx.model
 * Created by lishuxia on 2017/10/30 上午11:23.
 * Description: 
 *******************************************************************************/
public class Student {
    private int id;
    private String  stuName;  //姓名
    private int stuId;          //学号
    private int stuSex;         //性别
    private String collage;     //学院
    private String nativePlace; //籍贯
    private int credit;         //学分
    private String email;       //邮箱
    private String phone;       //手机号

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStuName() {
        return stuName;
    }

    public void setStuName(String stuName) {
        this.stuName = stuName;
    }

    public int getStuId() {
        return stuId;
    }

    public void setStuId(int stuId) {
        this.stuId = stuId;
    }

    public int getStuSex() {
        return stuSex;
    }

    public void setStuSex(int stuSex) {
        this.stuSex = stuSex;
    }

    public String getCollage() {
        return collage;
    }

    public void setCollage(String collage) {
        this.collage = collage;
    }

    public String getNativePlace() {
        return nativePlace;
    }

    public void setNativePlace(String nativePlace) {
        this.nativePlace = nativePlace;
    }

    public int getCredit() {
        return credit;
    }

    public void setCredit(int credit) {
        this.credit = credit;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public void setStudent(String stuName,int stuId,int stuSex,String collage,String nativePlace,int credit,String email,String phone){
        this.stuName = stuName;
        this.stuId = stuId;
        this.stuSex = stuSex;
        this.collage = collage;
        this.nativePlace = nativePlace;
        this.credit = credit;
        this.email = email;
        this.phone = phone;

    }

}
