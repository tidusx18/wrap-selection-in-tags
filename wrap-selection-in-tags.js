// ==UserScript==
// @name         Wrap Selection in Tags
// @version      0.0.1
// @description  Adds HTML language attribute to selected content in TinyMCE editor.
// @author       Daniel Victoriano
// @match        https://fiu.blackboard.com/*
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
  'use strict';
  if(unsafeWindow.tinyMCE !== undefined) {

    setTimeout(function() {

      // Global variables
      var selectedContentHtml,
          selectedContentText,
          selectedContentAncestorNode,
          selectedContentAncestorNodeText,
          selectboxValue,
          lang;

      // Get Editor instance by ID
      // Editor ID varies so get ID first
      // Assumes only 1 textarea element in DOM
      var tinymceId = document.getElementsByTagName("textarea")[0].id;
      var tinyMCE = unsafeWindow.tinyMCE.getInstanceById(tinymceId);

      // Create td node with dropdown select list
      var newMenu = document.createElement("td");
      newMenu.style.position = "relative";
      newMenu.innerHTML = `<select style="width: 120px; max-width: 120px !important;" id="langSelectBox" class="mceNativeListBox" tabindex="-1">
      <option value="">Language Tag</option>
      <option value="Spanish">Spanish</option>
      <option value="French">French</option>
      <option value="Italian">Italian</option>
      </select>`;

      // Insert node in Editor's toolbar
      var editorTable = document.querySelector(`#${tinymceId}_toolbar2 tr`);
      var insertLocation = editorTable.children.length-1;
      editorTable.insertBefore(newMenu, editorTable.children[insertLocation]);

      // Event listener on select box
      var langSelectBox = document.getElementById("langSelectBox");
      langSelectBox.addEventListener("change", function() {
        setContent();
        selectLanguage();

        if (!tinyMCE.selection.isCollapsed()) {
          if (selectedContentText == selectedContentAncestorNodeText && selectedContentAncestorNode.nodeName != "TD") {
            addLangAttribute();
          }
          else if (selectedContentText != selectedContentAncestorNodeText) {
            wrapSelection();
          }
        }
        else {
          alert("Nothing is selected. First, select some content in the editor and try agian.");
          resetSelectBox();
        }
      });

      function setContent() {
        selectedContentHtml = tinyMCE.selection.getContent({format: "html"});
        selectedContentText = tinyMCE.selection.getRng().toString().trim();
        selectedContentAncestorNode = tinyMCE.selection.getNode();
        selectedContentAncestorNodeText = tinyMCE.selection.getNode().textContent.trim();
        selectboxValue = document.getElementById("langSelectBox").value;
      }

      // Wrap selected content with inline DIV tag with lang attribute
      function wrapSelection() {
        tinyMCE.selection.setContent(`<span lang="${lang}">${selectedContentHtml}</span>`);
        resetSelectBox();
        console.log("Wrapped selected content in new HTML node with language attribute.");
      }

      // Add lang attribute to selected content's node
      function addLangAttribute() {
        selectedContentAncestorNode.lang = `${lang}`;
        resetSelectBox();
        console.log("Added lang attribute to ancestor node.");
      }

      // Select the language
      function selectLanguage() {
        switch (selectboxValue) {
          case "Spanish":
            lang = "es";
            break;

          case "French":
            lang = "fr";
            break;

          case "Italian":
            lang = "it";
            break;

          default:
            lang = "";
            console.log("lang is undefined!");
            break;
        }
      }

      // Reset select box to label (no option selection)
      function resetSelectBox() {
        document.getElementById("langSelectBox").selectedIndex = 0;
      }
    }, 2100);
  }
})();
