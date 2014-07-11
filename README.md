spsearchuserautocomplete
========================

Project Description


Search user/group with presence from search input box in SharePoint 2013. 

Features:

Update SharePoint 2013 search input box to search people with the presence
Redirect to profile page on selection [Optional] 

Prerequisites

- SharePoint 2013
- JQuery 1.8.x +
- JQuery UI JS 1.10.x
- JQuery UI CSS 1.10.x

Installation

- Copy jquery.searchpeople.js, imgPreload.js and spinner.gif to Site.
- Add reference to the page/masterpage

<script src="http://code.jquery.com/jquery-1.8.3.min.js" type="text/javascript"></script>
<script src="http://code.jquery.com/ui/1.10.1/jquery-ui.min.js" type="text/javascript"></script>
<script src="/SiteAssets/jquery.searchpeople.js" type="text/javascript"></script>
<script src="/SiteAssets/imgPreload.js" type="text/javascript"></script>
<link href="http://code.jquery.com/ui/1.10.1/themes/smoothness/jquery-ui.css" type="text/css"/>
- Add following JavaScript

<script type="text/javascript">

jQuery(document).ready(function () {
   var settings = {mySiteUrl: "http://PROFILE_URL", redirectToProfilePage: false, maxSuggetions: 20, showpicture: true, principleType: 1}
   jQuery.searchPeople(settings); 
}); 
</script>


Settings

mySiteUrl : 
My site url. User will redirect to profile page url. default: ""
e.g.  http://PROFILE_URL/person.aspx?accountname=NETWOR_ID 

redirectToProfilePage : 
    If true then user will be redirected to profile page url on selection. default: false

maxSuggetions : 
    Max suggetions. default 10.

showpicture: 
    default: true

principalType: 
    Principal type to search. default: 0
    options: 
        0 - [User, DL, SecGroup, SPGroup]
        1 - [User]
        2 - [DL]
        4 - [SecGroup]
        8 - [SPGroup]
        
jQuery search people also uses imgPreload plugin(http://denysonique.github.io/imgPreload/) to show spinner before loading the user picture.        
