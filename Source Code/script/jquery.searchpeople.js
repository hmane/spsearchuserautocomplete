;
(function ($) {
    var defaults = {
        redirectToProfilePage: false,
        maxSuggetions: 10,
        mySiteUrl: "",
        showpicture: true,
        principalType: 1
    };

    $.searchPeople = function (options) {

        options = $.extend({}, defaults, options);

        var data;

        $.extend($.ui.autocomplete.prototype, {
            _renderItem: function (ul, item) {
                var term = this.element.val(),
                    regex = new RegExp('(' + term + ')', 'gi');
                html = item.label.replace(regex, "<b>$&</b>");
                if (item.email != null) {
                    if (options.showpicture) {
                        return $("<li><span class='ms-imnSpan'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()' style='padding:0px;'><div class='ms-tableCell'><span class='ms-imnlink ms-spimn-presenceLink'><span class='ms-spimn-presenceWrapper ms-spimn-imgSize-5x36'><img name='imnmark' title='' showofflinepawn='1' class='ms-spimn-img ms-spimn-presence-offline-5x36x32' src='/_layouts/15/images/spimn.png' sip='" + item["sip"] + "' id='imn_" + item["email"] + ",type=sip' /></span></span></div><div class='ms-tableCell ms-verticalAlignTop'><div class='ms-peopleux-userImgDiv'><span><img title='' showofflinepawn='1' class='ms-hide' src='/_layouts/15/images/spimn.png' alt='Offline' sip='" + item["email"] + "' id='Img1' /><span class='ms-peopleux-imgUserLink'><span class='ms-peopleux-userImgWrapper' style='width: 36px; height: 36px;'><img class='userIMG' style='width: 36px; height: 36px; clip: rect(0px, 36px, 36px, 0px);' src='" + options.mySiteUrl + "/_layouts/15/userphoto.aspx?accountname=" + item["networkaddress"] + "&amp;size=S\' alt='" + item["value"] + "' /></span></span></span></div></div><div class='ms-tableCell ms-verticalAlignTop' style='padding-left: 10px;'><span class='resultName'>" + html + "</span><span style='font-size: 0.9em; display: block;'>" + item["title"] + "</span></div></a></span></li>")
                            .appendTo(ul);
                    } else {
                        return $("<li><span class='ms-imnSpan'><a onmouseover='IMNShowOOUI();' onmouseout='IMNHideOOUI()'  href='#' class='ms-imnlink ms-spimn-presenceLink' ><span class='ms-spimn-presenceWrapper ms-imnImg ms-spimn-imgSize-10x10'><img name='imnmark' title='' ShowOfflinePawn='1' class='ms-spimn-img ms-spimn-presence-offline-10x10x32' src='/_layouts/15/images/spimn.png?rev=23' alt='User Presence' sip='" + item["sip"] + "' id='imn_" + item["email"] + ",type=sip' /></span>" + item["value"] + "</a></span></li>")
                            .appendTo(ul);
                    }
                } else {
                    return $("<li></li><li>" + item.label + "</li>").appendTo(ul);
                }
            }
        });

        RegisterSod("autofill.js", "/_layouts/15/autofill.js");

        $(".ms-srch-sb input").autocomplete({
            source: function (request, response) {
                if (options.showpicture) {
                    $('.picSpinner').remove();
                }
                EnsureScript('SP.js', typeof SP.ClientContext, function () {
                    EnsureScript('autofill.js', typeof SPClientAutoFill, function () {
                        var query = new SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters();
                        query.set_allowMultipleEntities(true);
                        query.set_maximumEntitySuggestions(options.maxSuggetions);
                        query.set_allowEmailAddresses(true);
                        query.set_principalType(options.principalType);
                        query.set_principalSource(15);
                        query.set_queryString($('.ms-srch-sb input').val());
                        var clientContext = SP.ClientContext.get_current();
                        var searchResult = SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser(clientContext, query);

                        clientContext.executeQueryAsync(function () {
                            var newData = [];
                            var results = clientContext.parseObjectFromJsonString(searchResult.get_value());
                            for (i = 0; i < results.length; i++) {
                                var filtered = $(newData).filter(function () {
                                    return this.value == results[i].DisplayText;
                                });
                                if (filtered.length == 0) {
                                    var title = results[i].EntityData.Title;
                                    if (title == undefined) {
                                        title = "";
                                    }
                                    var sip = results[i].EntityData.SIPAddress;
                                    if (sip == undefined) {
                                        sip = results[i].EntityData.Email;
                                    }

                                    newData.push({
                                        value: results[i].DisplayText,
                                        id: results[i].Key,
                                        email: results[i].EntityData.Email,
                                        networkaddress: results[i].Description,
                                        title: title,
                                        sip: sip
                                    });
                                }
                            }
                            newData = newData.sort(function (a, b) {
                                return b.id.localeCompare(a.id);
                            });
                            data = newData.slice();
                            response($.ui.autocomplete.filter(newData, request.term));
                        });
                    });
                });
            },
            select: function (event, ui) {
                if (options.redirectToProfilePage) {
                    if (ui.item.networkaddress != null) {
                        SP.Utilities.HttpUtility.navigateTo(options.mySiteUrl + '/Person.aspx?accountname=' + ui.item.networkaddress);
                    } else {
                        var searchTerm = $('.ms-srch-sb input').val();
                        EnsureScriptFunc('Search.ClientControls.js', 'Srch.U', function () {
                            $find($('#SearchBox').parent('div')[0].id).search(searchTerm);
                        });
                    }
                }
            },
            response: function (event, ui) {
                if (options.redirectToProfilePage) {
                    var encodeSearch = encodeURIComponent($('.ms-srch-sb input').val());
                    ui.content.push({
                        label: "<a class='searchLink' href='javascript: {}'>Search for \"<i>" + $('.ms-srch-sb input').val() + "</i>\"</a>",
                        id: "SearchLink",
                        button: true
                    });
                }
            },
            open: function () {
                var pos = $('.ui-autocomplete').position();
                $('.ui-menu-item').css('list-style-image', "none");
                $('.ui-autocomplete').css("top", (pos.top + 3) + "px");
                $('.ui-autocomplete').css("left", (pos.left - 5) + "px");
                ProcessImn();
                if (options.showpicture) {
                    $(".userIMG").imgPreload({
                        spinner_src: '/SiteAssets/spinner.gif'
                    });
                }
            }
        });
        if (options.redirectToProfilePage) {
            $(".ms-srch-sb-searchLink").click(function () {
                var searchItem = $(".ms-srch-sb input").val().toLowerCase();
                for (i = 0; i < data.length; i++) {
                    if (data[i].value.toLowerCase() == searchItem.toLowerCase()) {

                        if (data[i].networkaddress != null) {
                            SP.Utilities.HttpUtility.navigateTo(options.mySiteUrl + '?accountname=' + data[i].networkaddress);
                        }
                    }
                }
            });
        }

        $(".ms-srch-sb-border input").keypress(function (e) {
            if (e.keyCode == 13 && options.redirectToProfilePage) {
                var searchItem = $(".ms-srch-sb input").val().toLowerCase();
                for (i = 0; i < data.length; i++) {
                    if (data[i].value.toLowerCase() == searchItem) {
                        SP.Utilities.HttpUtility.navigateTo(data[i].id);
                        return false;
                    }
                }
            }
        });
    }
})($);