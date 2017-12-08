<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="java.util.Date"%>
<c:set var="globalVersion" value="1.0-20151222.1812"></c:set>
<%
    response.setHeader("Pragma","No-cache");
    response.setHeader("Cache-Control","no-cache");
    response.setDateHeader("Expires", 0);
    String path = request.getContextPath();
    String temp=request.getServerPort()==80?"":":"+request.getServerPort();
    String basePath = request.getScheme() + "://" + request.getServerName() + temp + path ;
    if(application.getAttribute(basePath)==null){
        application.setAttribute("basePath",basePath);
    }
    String pageId = new Date().getTime() + "_" + Math.random();

%>