/**
 * Zikula Application Framework
 *
 * @copyright (c) 2001, Zikula Development Team
 * @link http://www.zikula.com
 * @version $Id$
 * @license GNU/GPL - http://www.gnu.org/copyleft/gpl.html
 * @package Zikula_System_Modules
 * @subpackage Permissions
 */

/**
 * User Check call
 *
 *@ no param
 *@return none;
 *@author Frank Chestnut
 */
function callusercheck()
{
    var pars = "module=Users&func=checkuser&" + Form.serialize('newuser');
    var myAjax = new Ajax.Request(
        document.location.pnbaseURL + "ajax.php",
        {
            method: 'post',
            parameters: pars,
            onComplete: checkuser_response
        });
}

/**
 * Ajax response function for checking the user registration information: simply shows a text
 *
 *@params none;
 *@return none;
 *@author Frank Chestnut
 */
function checkuser_response(req)
{
    if (req.status != 200 ) {
        pnshowajaxerror(req.responseText);
        return;
    }
    var json = pndejsonize(req.responseText);

    pnupdateauthids(json.authid);
    $('newuserauthid').value = json.authid;

    var result     = json.result;
    var errorcode  = json.errorcode;
    var formfields = Form.getElements("newuser");
    // Resetting before going further
    for (var i = 0; i < formfields.length; i++) {
        Element.removeClassName(formfields[i], 'errorrequired');
    }
    Element.removeClassName('users_agreetoterms', 'errorrequired');

    showerrortext(errorcode, result);
    if (errorcode == 1) {
    	$('submitnewuser').disabled = false; 
    } else {
        switch(errorcode) {
            case 2:
              Element.addClassName('users_email', 'errorrequired');
              break;
            case 3:
              Element.addClassName('users_agreetoterms', 'errorrequired');
              break;
            case 4:
              Element.addClassName('users_uname', 'errorrequired');
              break;
            case 5:
              Element.addClassName('users_uname', 'errorrequired');
              break;
            case 6:
              Element.addClassName('users_uname', 'errorrequired');
              break;
            case 7:
              Element.addClassName('users_uname', 'errorrequired');
              break;
            case 8:
              Element.addClassName('users_uname', 'errorrequired');
              break;
            case 9:
              Element.addClassName('users_email', 'errorrequired');
              break;
            case 10:
              Element.addClassName('users_email', 'errorrequired');
              Element.addClassName('users_vemail', 'errorrequired');
              break;
            case 11:
              break;
            case 12:
              Element.addClassName('users_email', 'errorrequired');
              break;
            case 14:
              Element.addClassName('users_reg_answer', 'errorrequired');
              break;
            case 15:
              Element.addClassName('users_pass', 'errorrequired');
              break;
            case 16:
              Element.addClassName('users_pass', 'errorrequired');
              Element.addClassName('users_vpass', 'errorrequired');
              break;
            case 17:
              Element.addClassName('users_pass', 'errorrequired');
              break;
            case 25:
              var fields = json.fields;
              for(var i = 0; i < fields.length; i++) {
                  //var field = document.getElementById(fields[i]);
                  Element.addClassName('prop' + fields[i].toLowerCase(), 'errorrequired');
              }
              break;
            default:
              for (var i = 0; i < formfields.length; i++) {
                  Element.removeClassName(formfields[i], 'errorrequired');
              }
              $('submitnewuser').disabled = true;
              break;
        }
    }
}

/**
 * Use to temporarily show an infotext instead of the permission.
 *@params errorno the error id;
 *@params infotext the text to show;
 *@return none;
 *@author Frank Chestnut
 */
function showerrortext(errorno, infotext)
{
    $A(document.getElementsByClassName('newuserinfo')).each(function(newuserinfo){
        if (errorno == 1) {
            Element.addClassName(newuserinfo, 'newuserinfook');
        } else {
            Element.removeClassName(newuserinfo, 'newuserinfook');
        }
        Element.removeClassName(newuserinfo, 'z-hide');
        Element.update(newuserinfo, infotext);
    });
}

function showdynamicsmenu()
{
  if (Element.hasClassName('profileadminlinks', 'z-hide')) {
      Element.removeClassName('profileadminlinks', 'z-hide');
  } else {
      Element.addClassName('profileadminlinks', 'z-hide');
  }
}

function liveusersearch()
{
    Element.removeClassName('liveusersearch', 'z-hide');
    Event.observe('modifyuser', 'click', function() { window.location.href=document.location.entrypoint + "?module=users&type=admin&func=modify&uname=" + $F('username');}, false);
    Event.observe('deleteuser', 'click', function() { window.location.href=document.location.entrypoint + "?module=users&type=admin&func=deleteusers&uname=" + $F('username');}, false);
    new Ajax.Autocompleter('username', 'username_choices', document.location.pnbaseURL + 'ajax.php?module=users&func=getusers',
                           {paramName: 'fragment',
                            minChars: 3,
                            afterUpdateElement: function(data){
                                Event.observe('modifyuser', 'click', function() { window.location.href=document.location.entrypoint + "?module=users&type=admin&func=modify&userid=" + $($(data).value).value;}, false);
                                Event.observe('deleteuser', 'click', function() { window.location.href=document.location.entrypoint + "?module=users&type=admin&func=deleteusers&userid=" + $($(data).value).value;}, false);
                                }
                            }
                            );
}

/* password strength meter from http://ajaxorized.com/?p=14 */
function getPasswordStrength(passwd) {
    intScore = 0;
    if (passwd.match(/[a-z]/)) // [verified] at least one lower case letter
    {
        intScore += 1
    }
    if (passwd.match(/[A-Z]/)) // [verified] at least one upper case letter
    {
        intScore += 5
    } // NUMBERS
    if (passwd.match(/\d+/)) // [verified] at least one number
    {
        intScore += 5
    }
    if (passwd.match(/(\d.*\d.*\d)/)) // [verified] at least three numbers
    {
        intScore += 5
    } // SPECIAL CHAR
    if (passwd.match(/[!,@#$%^&*?_~]/)) // [verified] at least one special character
    {
        intScore += 5;
    }
    if (passwd.match(/([!,@#$%^&*?_~].*[!,@#$%^&*?_~])/)) // [verified] at least two special characters
    {
        intScore += 5;
    } // COMBOS
    if (passwd.match(/[a-z]/) && passwd.match(/[A-Z]/)) // [verified] both upper and lower case
    {
        intScore += 2;
    }
    if (passwd.match(/\d/) && passwd.match(/\D/)) // [verified] both letters and numbers
    {
        intScore += 2;
    } // [Verified] Upper Letters, Lower Letters, numbers and special characters
    if (passwd.match(/[a-z]/) && passwd.match(/[A-Z]/) && passwd.match(/\d/) && passwd.match(/[!,@#$%^&*?_~]/))
    {
        intScore += 2;
    }
    return intScore;
}

function updatePasswordStrength(pw) {
    var strength = getPasswordStrength(pw);
    var width = (100/32) * strength;
    new Effect.Morph('pwsmeter', {style:'width:' + width + 'px', duration:'0.4'}); 
}
