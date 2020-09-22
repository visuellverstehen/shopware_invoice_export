import template from './invoice-export-create.html.twig';
import './invoice-export-create.scss';

Shopware.Component.register('invoice-export-create', {
    template,

    data(){
        return {
            fromDate: null,
            toDate: new Date().toISOString(),
            httpClient: null,
            token: null,
            settings: {
                id: null,
                debitor: 0,
                costNumber: 0,
                taxNumberSeven: 0,
                taxNumberNineteen: 0,
                lastExportAt: ''
            },
            errorMessage: null,
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        }
    },


    created() {
        this.httpClient = Shopware.Application.getContainer('init').httpClient;
        this.getBearerToken();
        this.loadSettings();
    },

    methods: {
        getBearerToken(){
            //try to get cookie from localStorage
            let localStorageBearer = localStorage.getItem('bearerAuth');

            if(localStorageBearer !== null){
                this.token = JSON.parse(localStorageBearer).access;
            }else{
                //some shopware versions store auth in cookie that needs to be parsed
                let cookieToken = this.getCookie('bearerAuth');

                if(cookieToken !== null){
                    this.token = JSON.parse(decodeURIComponent(cookieToken));
                }
            }
        },

        loadSettings(){
            this.httpClient.get('/visuel/invoice-export/settings/load', {
                headers: {
                    'Authorization': 'Bearer ' + this.token.access
                }
            }).then(response => {
                if(response.status === 200){
                    if(response.data[0][0]){
                        this.settings = response.data[0][0];
                    }else if(Object.keys(response.data[0].elements).length > 0){
                        this.settings = Object.values(response.data[0].elements)[0];
                    }
                }else{
                    this.errorMessage = this.$t('invoice-export.application.errors.loadingSettings');
                }
            });
        },

        saveSettings(){
            this.httpClient.post("/visuel/invoice-export/settings/save" ,
            {
                settings: this.settings,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.token.access
                }
            }).then(response => {
                if(response.status !== 200){
                    this.errorMessage = this.$t('invoice-export.application.errors.savingSettings');
                }
            });
        },

        startExport(){
            this.saveSettings();
            this.httpClient.post("/visuel/invoice-export" ,
            {
                fromDate: this.fromDate,
                toDate: this.toDate,
                settingsId: this.settings.id,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.token.access
                }
            }).then(response => {
                if(response.status === 200){
                    this.errorMessage = null;
                    var fileURL = window.URL.createObjectURL(
                        new Blob(
                            [new Uint8Array([0xEF, 0xBB, 0xBF]), response.data],
                            {type: 'text/csv;charset=utf-8'}
                        )
                    );
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', 'invoice_export_'  + Date.now() +  '.csv');
                    document.body.appendChild(fileLink);

                    fileLink.click();
                }else if(response.status === 204){
                    this.errorMessage = this.$t('invoice-export.application.errors.noOrdersFound');
                }
            });
        },

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2){
                return parts.pop().split(';').shift();
            }
            return null;
        },
    },
});
