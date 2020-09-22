(this.webpackJsonp=this.webpackJsonp||[]).push([["visuel-invoice-export"],{GNGj:function(e){e.exports=JSON.parse('{"invoice-export":{"general":{"name":"Invoice Export","title":"Invoice Export","description":"Export orders for finance"},"navigation":{"label":"Invoice Export"},"application":{"settings":{"finance":{"sectionLabel":"Tax accounts","sevenLabel":"Revenue account 7% tax","nineteenLabel":"Revenue account 19% tax","debitorLabel":"Debtor","costLabel":"Cost center"},"export":{"sectionLabel":"Export","fromDateLabel":"Date from which orders should be exported","toDateLabel":"Date  to which orders should be exported","lastExportLabel":"Last export at"}},"buttons":{"startExportLabel":"Export invoices"},"errors":{"noOrdersFound":"No orders found for the chosen timespan!","loadingSettings":"An error occured while loading the settings","savingSettings":"An error occured while saving the settings"}}}}')},"N+Y6":function(e){e.exports=JSON.parse('{"invoice-export":{"general":{"name":"Rechnungsexport","title":"Rechnungsexport","description":"Rechnungen für die Buchhaltung exportieren"},"navigation":{"label":"Rechnungsexport"},"application":{"settings":{"finance":{"sectionLabel":"Steuerkonten","sevenLabel":"Erlöskonto bei 7% Steuern","nineteenLabel":"Erlöskonto bei 19% Steuern","debitorLabel":"Debitor","costLabel":"Kostenstelle"},"export":{"sectionLabel":"Export","fromDateLabel":"Datum,  ab dem Bestellungen exportiert werden sollen","toDateLabel":"Datum, bis zu dem Bestellungen exportiert werden sollen","lastExportLabel":"Letzter Export"}},"buttons":{"startExportLabel":"Rechnungen exportieren"},"errors":{"noOrdersFound":"Für den ausgewählten Zeitraum konnten keine Bestellungen gefunden werden!","loadingSettings":"Beim Laden der Einstellungen ist ein Fehler aufgetreten","savingSettings":"Beim Speichern der Einstellungen ist ein Fehler aufgetreten"}}}}')},QMfx:function(e,t,n){var i=n("SCRi");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);(0,n("SZ7m").default)("2e19b20b",i,!0,{})},SCRi:function(e,t,n){},YGoS:function(e,t){e.exports='{% block invoice_export_create %}\n    <sw-page class="invoice-export-create">\n        <template slot="content">\n            <sw-card-view>\n                <div v-if="errorMessage" class="error--message-container">\n                    <span class="error--message">{{ errorMessage }}</span>\n                </div>\n                <sw-card :title="$t(\'invoice-export.application.settings.finance.sectionLabel\')">\n                    <sw-number-field\n                        v-model="settings.taxNumberSeven"\n                        numberType="int"\n                        :step="null"\n                        :min="null"\n                        :max="null"\n                        :value="null"\n                        :label="$t(\'invoice-export.application.settings.finance.sevenLabel\')" />\n\n                    <sw-number-field\n                    v-model="settings.taxNumberNineteen"\n                    numberType="int"\n                    :step="null"\n                    :min="null"\n                    :max="null"\n                    :value="null"\n                    :label="$t(\'invoice-export.application.settings.finance.nineteenLabel\')" />\n\n                    <sw-number-field\n                    v-model="settings.debitor"\n                    numberType="int"\n                    :step="null"\n                    :min="null"\n                    :max="null"\n                    :value="null"\n                    :label="$t(\'invoice-export.application.settings.finance.debitorLabel\')"/>\n\n                    <sw-number-field\n                    v-model="settings.costNumber"\n                    numberType="int"\n                    :step="null"\n                    :min="null"\n                    :max="null"\n                    :value="null"\n                    :label="$t(\'invoice-export.application.settings.finance.costLabel\')"/>\n                </sw-card>\n\n                <sw-card :title="$t(\'invoice-export.application.settings.export.sectionLabel\')">\n                    <sw-datepicker\n                    id="from-date"\n                    v-model="fromDate"\n                    :label="$t(\'invoice-export.application.settings.export.fromDateLabel\')"/>\n\n                    <sw-datepicker\n                    id="to-date"\n                    v-model="toDate"\n                    :label="$t(\'invoice-export.application.settings.export.toDateLabel\')"/>\n\n                    <sw-container columns="1fr 1fr">\n                        <div>\n                            <sw-button variant="primary" @click="startExport">\n                                        {{$t(\'invoice-export.application.buttons.startExportLabel\')}}\n                            </sw-button>\n                        </div>\n                        <div class="last-export--container">\n                            <p>{{$t(\'invoice-export.application.settings.export.lastExportLabel\')}}: {{new Date(settings.lastExportAt).toLocaleDateString()}} {{new Date(settings.lastExportAt).toLocaleTimeString()}}</p>\n                        </div>\n                    </sw-container>\n                </sw-card>\n            </sw-card-view>\n        </template>\n    </sw-page>\n{% endblock %}\n'},uahR:function(e,t,n){"use strict";n.r(t);var i=n("YGoS"),o=n.n(i);n("QMfx");Shopware.Component.register("invoice-export-create",{template:o.a,data:()=>({fromDate:null,toDate:(new Date).toISOString(),httpClient:null,token:null,settings:{id:null,debitor:0,costNumber:0,taxNumberSeven:0,taxNumberNineteen:0,lastExportAt:""},errorMessage:null}),metaInfo(){return{title:this.$createTitle()}},created(){this.httpClient=Shopware.Application.getContainer("init").httpClient,this.getBearerToken(),this.loadSettings()},methods:{getBearerToken(){let e=localStorage.getItem("bearerAuth");if(null!==e)this.token=JSON.parse(e).access;else{let e=this.getCookie("bearerAuth");null!==e&&(this.token=JSON.parse(decodeURIComponent(e)))}},loadSettings(){this.httpClient.get("/visuel/invoice-export/settings/load",{headers:{Authorization:"Bearer "+this.token.access}}).then(e=>{200===e.status?e.data[0][0]?this.settings=e.data[0][0]:Object.keys(e.data[0].elements).length>0&&(this.settings=Object.values(e.data[0].elements)[0]):this.errorMessage=this.$t("invoice-export.application.errors.loadingSettings")})},saveSettings(){this.httpClient.post("/visuel/invoice-export/settings/save",{settings:this.settings},{headers:{Authorization:"Bearer "+this.token.access}}).then(e=>{200!==e.status&&(this.errorMessage=this.$t("invoice-export.application.errors.savingSettings"))})},startExport(){this.saveSettings(),this.httpClient.post("/visuel/invoice-export",{fromDate:this.fromDate,toDate:this.toDate,settingsId:this.settings.id},{headers:{Authorization:"Bearer "+this.token.access}}).then(e=>{if(200===e.status){this.errorMessage=null;var t=window.URL.createObjectURL(new Blob([new Uint8Array([239,187,191]),e.data],{type:"text/csv;charset=utf-8"})),n=document.createElement("a");n.href=t,n.setAttribute("download","invoice_export_"+Date.now()+".csv"),document.body.appendChild(n),n.click()}else 204===e.status&&(this.errorMessage=this.$t("invoice-export.application.errors.noOrdersFound"))})},getCookie(e){const t=`; ${document.cookie}`.split(`; ${e}=`);return 2===t.length?t.pop().split(";").shift():null}}});var a=n("N+Y6"),r=n("GNGj");Shopware.Module.register("invoice-export",{name:"invoice-export.general.name",type:"plugin",color:"#ff3d58",icon:"default-action-move-file",title:"invoice-export.general.title",description:"invoice-export.general.description",routes:{create:{component:"invoice-export-create",path:"create",meta:{parentPath:"invoice.export.create"}}},navigation:[{label:"invoice-export.navigation.label",color:"#ffffff",path:"invoice.export.create",icon:"default-action-move-file",position:100,parent:"sw-order"}],snippets:{"de-DE":a,"en-GB":r}})}},[["uahR","runtime","vendors-node"]]]);