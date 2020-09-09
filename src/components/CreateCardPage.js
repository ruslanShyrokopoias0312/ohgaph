import React from 'react'
import {
    StyleSheet, View, TouchableOpacity, TouchableHighlight,
    Text, TextInput, Dimensions, ScrollView, Alert, Linking,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'
import FCM from 'react-native-fcm'
import { Actions, ActionConst } from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'
import RNPickerSelect from 'react-native-picker-select'
import Modal from 'react-native-modalbox'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { errorHandle, fetchAddressByPostal } from '../lib/api'
import { register } from '../lib/fcm'
import { registerCard } from '../lib/card'
import { FormInput, FormCheckBox, ConfirmRows, FormSubmit } from './parts/form'

const isTablet = DeviceInfo.isTablet()

const { height, width } = Dimensions.get('window')

export default class CreateCardPage extends React.Component {
    constructor() {
        super()
        this.state = {
            firstName: "",
            lastName: "",
            kanaFirstName: "",
            kanaLastName: "",

            year: "",
            month: "",
            date: "",

            gender: "male",

            postalStart: "",
            postalEnd: "",

            prefecture: "",

            city: "",
            addressDetail: "",

            phoneStart: "",
            phoneMiddle: "",
            phoneEnd: "",

            swipeToClose: false,
            checkStatePolicy: false,
            checkStatePrivacy: false,
            mailing: true,

            confirmState: false,

            yearItems: this.getYearItems(),
            monthItems: this.getMonthItems(),
            dateItems: this.getDateItems(),
            prefectureItems: [
                { label: "北海道", value: "北海道", },
                { label: "青森県", value: "青森県", },
                { label: "岩手県", value: "岩手県", },
                { label: "秋田県", value: "秋田県", },
                { label: "宮城県", value: "宮城県", },
                { label: "山形県", value: "山形県", },
                { label: "福島県", value: "福島県", },
                { label: "茨城県", value: "茨城県", },
                { label: "栃木県", value: "栃木県", },
                { label: "群馬県", value: "群馬県", },
                { label: "埼玉県", value: "埼玉県", },
                { label: "千葉県", value: "千葉県", },
                { label: "東京都", value: "東京都", },
                { label: "神奈川県", value: "神奈川県", },
                { label: "新潟県", value: "新潟県", },
                { label: "富山県", value: "富山県", },
                { label: "石川県", value: "石川県", },
                { label: "福井県", value: "福井県", },
                { label: "山梨県", value: "山梨県", },
                { label: "長野県", value: "長野県", },
                { label: "岐阜県", value: "岐阜県", },
                { label: "静岡県", value: "静岡県", },
                { label: "愛知県", value: "愛知県", },
                { label: "三重県", value: "三重県", },
                { label: "滋賀県県", value: "滋賀県県", },
                { label: "京都府", value: "京都府", },
                { label: "大阪府", value: "大阪府", },
                { label: "兵庫県", value: "兵庫県", },
                { label: "奈良県", value: "奈良県", },
                { label: "和歌山県", value: "和歌山県", },
                { label: "鳥取県", value: "鳥取県", },
                { label: "島根県", value: "島根県", },
                { label: "岡山県", value: "岡山県", },
                { label: "広島県", value: "広島県", },
                { label: "山口県", value: "山口県", },
                { label: "徳島県", value: "徳島県", },
                { label: "香川県", value: "香川県", },
                { label: "愛媛県", value: "愛媛県", },
                { label: "高知県", value: "高知県", },
                { label: "福岡県", value: "福岡県", },
                { label: "佐賀県", value: "佐賀県", },
                { label: "長崎県", value: "長崎県", },
                { label: "熊本県", value: "熊本県", },
                { label: "大分県", value: "大分県", },
                { label: "宮崎県", value: "宮崎県", },
                { label: "鹿児島県", value: "鹿児島県", },
                { label: "沖縄県", value: "沖縄県", },
            ]

        }

        // セレクトボックスのrefs
        this.inputRefs = {}

        // ハンドラー、handlerオブジェクトを作ってその中に内包させるようにしたい。膨大。
        this.onPressPolicy = this.onPressPolicy.bind(this)
        this.onPressPrivacy = this.onPressPrivacy.bind(this)

        this.onChangeFirstName = this.onChangeFirstName.bind(this)
        this.onChangeLastName = this.onChangeLastName.bind(this)
        this.onChangeKanaFirstName = this.onChangeKanaFirstName.bind(this)
        this.onChangeKanaLastName = this.onChangeKanaLastName.bind(this)

        this.onChangeBirthYear = this.onChangeBirthYear.bind(this)
        this.onChangeBirthMonth = this.onChangeBirthMonth.bind(this)
        this.onChangeBirthDate = this.onChangeBirthDate.bind(this)

        this.onChangeGender = this.onChangeGender.bind(this)

        this.onChangePostalStart = this.onChangePostalStart.bind(this)
        this.onChangePostalEnd = this.onChangePostalEnd.bind(this)

        this.onChangePrefecture = this.onChangePrefecture.bind(this)
        this.onChangeCity = this.onChangeCity.bind(this)
        this.onChangeAddressDetail = this.onChangeAddressDetail.bind(this)

        this.onChangePhoneStart = this.onChangePhoneStart.bind(this)
        this.onChangePhoneMiddle = this.onChangePhoneMiddle.bind(this)
        this.onChangePhoneEnd = this.onChangePhoneEnd.bind(this)

        this.onCheckPolicy = this.onCheckPolicy.bind(this)
        this.onCheckPrivacy = this.onCheckPrivacy.bind(this)
        this.onChangeMailing = this.onChangeMailing.bind(this)

        this.onClickSearchAddress = this.onClickSearchAddress.bind(this)

        this.onPressSubmit = this.onPressSubmit.bind(this)
        this.onCloseConfirm = this.onCloseConfirm.bind(this)
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <LinearGradient style={{position: 'relative', flex: 1, paddingTop: 30}} colors={['#ef6e87', '#f3a8b4']}>
                    {this.confirmContainer()}
                    {this.inputContainer()}
                </LinearGradient>
            </ScrollView>
        )
    }

    getYearItems() {
        const end = (new Date()).getFullYear()
        return this.getTimeItems(1909, end)
    }

    getMonthItems() {
        return this.getTimeItems(0, 12)
    }

    getDateItems() {
        return this.getTimeItems(0, 31)
    }

    getTimeItems(start, end) {
        const rs = []
        for(let i = start; i < end; ++i) {
            rs.push({
                label: String(i + 1),
                value: String(i + 1),
            })
        }
        return rs
    }

    confirmContainer() {
        if(!this.state.confirmState) {
            return <Text></Text>
        }
        return (
            <View style={styles.confirmContainer}>
                <View style={styles.confirmInputs}>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>お名前：</Text>
                        <Text style={styles.confirmRowValue}>{this.state.firstName} {this.state.lastName}</Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>フリガナ：</Text>
                        <Text style={styles.confirmRowValue}>{this.state.kanaFirstName} {this.state.kanaLastName}</Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>生年月日：</Text>
                        <Text style={styles.confirmRowValue}>
                            {this.state.year}年{this.state.month}月{this.state.date}日
                        </Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>郵便番号：</Text>
                        <Text style={styles.confirmRowValue}>{this.state.postalStart}-{this.state.postalEnd}</Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>住所：</Text>
                        <Text style={styles.confirmRowValue}>
                            {this.state.prefecture}{this.state.city}{this.state.addressDetail}
                        </Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>電話電話：</Text>
                        <Text style={styles.confirmRowValue}>
                            {this.state.phoneStart}-{this.state.phoneMiddle}-{this.state.phoneEnd}
                        </Text>
                    </View>
                </View>
                <Text style={styles.confirmSentence}>こちらの内容で登録されました。</Text>
                <Text style={styles.confirmSentence}>よろしければログインボタンを、登録情報に誤りが</Text>
                <Text style={styles.confirmSentence}>ある方は戻るボタンをタップしてください。</Text>
                <View style={styles.confirmBtnGroup}>
                    <TouchableOpacity
                        onPress={this.onCloseConfirm}
                        style={styles.confirmCancelBtn}
                    >
                        <Text style={styles.backBtnLabel}>戻る</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onConfirm.bind(this)}
                        style={styles.confirmSubmitBtn}
                    >
                        <Text style={styles.submitLabel}>ログイン</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    inputContainer() {
        if(this.state.confirmState) {
            return <Text></Text>
        }
        return (
            <View>
                <Text style={styles.formHeaderNotice}>お手数ですが、すべての項目を入力お願いします。</Text>
                <View style={styles.formSection}>
                    <Text style={styles.formCtrlCaption}>お名前</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangeFirstName}
                            placeHolder="姓"
                            value={this.state.firstName}
                        />
                        <Text> </Text>
                        <FormInput
                            type="default"
                            onChange={this.onChangeLastName}
                            placeHolder="名"
                            value={this.state.lastName}
                        />
                    </View>
                    <Text style={styles.formCtrlCaption}>フリガナ</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangeKanaFirstName}
                            placeHolder="セイ"
                            value={this.state.kanaFirstName}
                        />
                        <Text> </Text>
                        <FormInput
                            type="default"
                            onChange={this.onChangeKanaLastName}
                            placeHolder="メイ"
                            value={this.state.kanaLastName}
                        />
                    </View>
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.formCtrlCaption}>生年月日</Text>
                    <View style={styles.selectBoxes}>
                        <View style={styles.selectCtrl}>
                            <RNPickerSelect
                                placeholder={{ label: '', value: null, }}
                                items={this.state.yearItems}
                                onValueChange={this.onChangeBirthYear}
                                onUpArrow={() => {
                                    this.inputRefs.year.focus();
                                }}
                                onDownArrow={() => {
                                    this.inputRefs.year.togglePicker();
                                }}
                                value={this.state.year}
                                ref={(el) => {
                                    this.inputRefs.year = el;
                                }}
                            >
                                <View style={styles.pickerSelectContainerStyleMD}>
                                    <Text style={styles.pickerSelectStyle}>{this.state.year}</Text>
                                </View>
                            </RNPickerSelect>
                            <Text style={styles.separatorTextLg}>年</Text>
                        </View>
                        <View style={styles.selectCtrl}>
                            <RNPickerSelect
                                placeholder={{ label: '', value: null, }}
                                items={this.state.monthItems}
                                onValueChange={this.onChangeBirthMonth}
                                value={this.state.month}
                                ref={(el) => {
                                    this.inputRefs.month = el;
                                }}
                            >
                                <View style={styles.pickerSelectContainerStyle}>
                                    <Text style={styles.pickerSelectStyle}>{this.state.month}</Text>
                                </View>
                            </RNPickerSelect>
                            <Text style={styles.separatorTextLg}>月</Text>
                        </View>
                        <View style={styles.selectCtrl}>
                            <RNPickerSelect
                                placeholder={{ label: '', value: null, }}
                                items={this.state.dateItems}
                                onValueChange={this.onChangeBirthDate}
                                value={this.state.date}
                                ref={(el) => {
                                    this.inputRefs.date = el;
                                }}
                            >
                                <View style={styles.pickerSelectContainerStyle}>
                                    <Text style={styles.pickerSelectStyle}>{this.state.date}</Text>
                                </View>
                            </RNPickerSelect>
                            <Text style={styles.separatorTextLg}>日</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.formCtrlCaption}>性別</Text>
                    <RadioForm
                        radio_props={this.genderProps()}
                        initial={0}
                        labelHorizontal={true}
                        formHorizontal={true}
                        buttonColor="#fff"
                        onPress={this.onChangeGender}
                    />
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.formCtrlCaption}>郵便番号</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangePostalStart}
                            placeHolder=""
                            value={this.state.postalStart}
                        />
                        <Text style={styles.separatorText}> - </Text>
                        <FormInput
                            type="default"
                            onChange={this.onChangePostalEnd}
                            placeHolder=""
                            value={this.state.postalEnd}
                        />
                        <TouchableHighlight style={styles.addressBtn} underlayColor={'rgb(60,163,217)'} onPress={this.onClickSearchAddress}>
                            <Text style={styles.addressLabel}>住所自動入力</Text>
                        </TouchableHighlight>
                    </View>
                    <Text style={styles.formCtrlCaption}>都道府県</Text>
                    <View style={styles.pickerRow}>
                        <RNPickerSelect
                            placeholder={{ label: '', value: null, }}
                            items={this.state.prefectureItems}
                            onValueChange={this.onChangePrefecture}
                            value={this.state.prefecture}
                            ref={(el) => {
                                this.inputRefs.prefecture = el;
                            }}
                        >
                            <View style={styles.pickerSelectContainerStyleLG}>
                                <Text style={styles.pickerSelectStyle}>{this.state.prefecture}</Text>
                            </View>
                        </RNPickerSelect>
                    </View>
                    <Text style={styles.formCtrlCaption}>市区町村</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangeCity}
                            placeHolder=""
                            value={this.state.city}
                        />
                    </View>
                    <Text style={styles.formCtrlCaption}>番地・建物名・部屋番号</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangeAddressDetail}
                            placeHolder=""
                            value={this.state.addressDetail}
                        />
                    </View>
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.formCtrlCaption}>電話番号</Text>
                    <View style={styles.inputRow}>
                        <FormInput
                            type="default"
                            onChange={this.onChangePhoneStart}
                            placeHolder=""
                            value={this.state.phoneStart}
                        />
                        <Text style={styles.separatorText}> - </Text>
                        <FormInput
                            type="default"
                            onChange={this.onChangePhoneMiddle}
                            placeHolder=""
                            value={this.state.phoneMiddle}
                        />
                        <Text style={styles.separatorText}> - </Text>
                        <FormInput
                            type="default"
                            onChange={this.onChangePhoneEnd}
                            placeHolder=""
                            value={this.state.phoneEnd}
                        />
                    </View>
                </View>
                <View style={styles.formSection}>
                    <FormCheckBox
                        onCheck={this.onCheckPolicy}
                        label={
                            <Text>
                                <Text onPress={this.onPressPolicy} style={styles.link}>利用規約</Text>に同意する
                            </Text>
                        }
                        checkState={this.state.checkStatePolicy}
                    />
                    <FormCheckBox
                        label={
                            <Text>
                                <Text onPress={this.onPressPrivacy} style={styles.link}>個人情報保護方針</Text>に同意する
                            </Text>
                        }
                        onCheck={this.onCheckPrivacy}
                        checkState={this.state.checkStatePrivacy}
                    />
                    <Text style={styles.whiteCaption}>郵送による情報提供</Text>
                    <RadioForm
                        radio_props={this.mailingProps()}
                        initial={0}
                        labelHorizontal={true}
                        formHorizontal={true}
                        buttonColor="#fff"
                        onPress={this.onChangeMailing}
                    />
                </View>
                <View style={styles.formSectionLg}>
                    <Text style={styles.notice}>ご注意事項:</Text>
                    <Text style={styles.notice}>カード番号とPIN番号は、必ずお控えください。{"\n"}
TOP画面のカードデザインをタッチすると確認もできます。</Text>
                    <FormSubmit onSubmit={this.onPressSubmit} label="登録する" />
                </View>
            </View>
        )
    }


    onChangeGender(value) {
        this.setState({gender:value})
    }

    onChangeMailing(value) {
        this.setState({mailing:value})
    }

    onPressPolicy() {
        const url = "https://www.ohga-ph.com/assets/pdf/bibica01.pdf"
        this.openLink(url)
    }

    onPressPrivacy() {
        const url = "https://www.ohga-ph.com/info/privacy.php"
        this.openLink(url)
    }

    openLink(url) {
        Linking.openURL(url).catch(err => {
            Alert.alert('URLを開けませんでした。')
        })
    }

    birthProps() {
        return [
            { label: '平成　', value: "平成" },
            { label: '昭和　', value: "昭和" },
            { label: '大正　', value: "大正" }
        ]
    }

    genderProps() {
        return [
            { label: '男性　', value: "male" },
            { label: '女性　', value: "female" },
        ]
    }

    mailingProps() {
        return [
            { label: '希望する　', value: true },
            { label: '希望しない　', value: false },
        ]
    }

    onCheckPolicy() {
        this.setState({
            checkStatePolicy: !this.state.checkStatePolicy,
        })
    }

    onCheckPrivacy() {
        this.setState({
            checkStatePrivacy: !this.state.checkStatePrivacy,
        })
    }

    onCheckMail() {
        this.setState({
            checkStateMail: !this.state.checkStateMail,
        })
    }

    isFormValid() {
        // fixme: 冗長
        const validList = [
            {
                isValid: this.state.firstName && this.state.firstName,
                item: "名前"
            },
            {
                isValid: this.state.kanaFirstName && this.state.kanaLastName,
                item: "カナ"
            },
            {
                isValid: this.state.year && this.state.month && this.state.date,
                item: "生年月日"
            },
            {
                isValid: this.state.postalStart && this.state.postalEnd && !isNaN(this.state.postalStart) && !isNaN(this.state.postalEnd),
                item: "郵便番号"
            },
            {
                isValid: this.state.prefecture && this.state.city && this.state.addressDetail,
                item: "住所"
            },
            {
                isValid: this.state.phoneStart && this.state.phoneMiddle && this.state.phoneEnd
                    && !isNaN(this.state.phoneStart) && !isNaN(this.state.phoneMiddle) && !isNaN(this.state.phoneEnd),
                item: "電話番号"
            },
        ]

        let isInvalid = false
        let errItems = []
        let errMsg = ""
        validList.map(validItem => {
            if(!validItem.isValid) {
                errItems.push(validItem.item)
                isInvalid = true
            }
        })

        if(isInvalid) {
            errItems = errItems.join(", ")
            errMsg = `${errItems}を正しく入力してください。`
            Alert.alert('エラー', errMsg)
            return false
        }

        if(!this.state.checkStatePolicy && !this.state.checkStatePrivacy) {
            Alert.alert('エラー', '利用規約と個人情報保護方針に同意してください。')
            return false
        }

        if(!this.state.checkStatePolicy) {
            Alert.alert('エラー', '利用規約に同意してください。')
            return false
        }

        if(!this.state.checkStatePrivacy) {
            Alert.alert('エラー', '個人情報保護方針に同意してください。')
            return false
        }

        return true
    }

    onChangeFirstName(text) {
        this.setState(Object.assign({}, this.state, {
            firstName: text,
        }))
    }

    onChangeLastName(text) {
        this.setState(Object.assign({}, this.state, {
            lastName: text,
        }))
    }

    onChangeKanaFirstName(text) {
        this.setState(Object.assign({}, this.state, {
            kanaFirstName: text,
        }))
    }

    onChangeKanaLastName(text) {
        this.setState(Object.assign({}, this.state, {
            kanaLastName: text,
        }))
    }

    onChangeBirthType(text) {
        this.setState(Object.assign({}, this.state, {
            birthType: text,
        }))
    }

    onChangeBirthYear(text) {
        this.setState(Object.assign({}, this.state, {
            year: text,
        }))
    }

    onChangeBirthMonth(text) {
        this.setState(Object.assign({}, this.state, {
            month: text,
        }))
    }

    onChangeBirthDate(text) {
        this.setState(Object.assign({}, this.state, {
            date: text,
        }))
    }

    onChangeGender(text) {
        this.setState(Object.assign({}, this.state, {
            gender: text,
        }))
    }

    onChangePostalStart(text) {
        this.setState(Object.assign({}, this.state, {
            postalStart: text,
        }))
    }

    onChangePostalEnd(text) {
        this.setState(Object.assign({}, this.state, {
            postalEnd: text,
        }))
    }

    onChangePrefecture(text) {
        this.setState(Object.assign({}, this.state, {
            prefecture: text,
        }))
    }

    onChangeCity(text) {
        this.setState(Object.assign({}, this.state, {
            city: text,
        }))
    }

    onChangeAddressDetail(text) {
        this.setState(Object.assign({}, this.state, {
            addressDetail: text,
        }))
    }

    onChangePhoneStart(text) {
        this.setState(Object.assign({}, this.state, {
            phoneStart: text,
        }))
    }

    onChangePhoneMiddle(text) {
        this.setState(Object.assign({}, this.state, {
            phoneMiddle: text,
        }))
    }

    onChangePhoneEnd(text) {
        this.setState(Object.assign({}, this.state, {
            phoneEnd: text,
        }))
    }

    async onClickSearchAddress() {
        const postalCode = this.state.postalStart + this.state.postalEnd

        const res = await fetchAddressByPostal(postalCode)
        this.setState({
            ...this.state,
            prefecture: res.data.pref,
            city: res.data.city,
            addressDetail: res.data.town,
        })

    }

    onPressSubmit() {
        if(!this.isFormValid()) {
            return
        }
        this.setState({
            ...this.state,
            confirmState: true,
        })
    }

    onCloseConfirm() {
        this.setState({
            ...this.state,
            confirmState: false,
        })
    }

    onConfirm() {
        const cardParams = {
            name: `${this.state.firstName} ${this.state.lastName}`,
            kana: `${this.state.kanaFirstName} ${this.state.kanaLastName}`,
            postal: `${this.state.postalStart} ${this.state.postalEnd}`,
            address: `${this.state.prefecture} ${this.state.city} ${this.state.addressDetail}`,
            phone: `${this.state.phoneStart} ${this.state.phoneMiddle} ${this.state.phoneEnd}`,
            birth: `${this.state.year}-${this.state.month}-${this.state.date}`,
            gender: this.state.gender,
            mailingState: this.state.mailing,
        }

        registerCard(cardParams).then(async (resp) => {
            await AsyncStorage.multiSet([
                ['card_number', String(resp.pre_card.card_number)],
                ['pin_number', String(resp.pre_card.pin_number)],
                ['jwt_token', resp.token],
                ['create_from_app', "true"]
            ])

            Alert.alert("登録されました", "カード画像をタップすると、カード番号とPINが表示されます。機種変更、WEBチャージなどで再認証が必要な場合に備え、必ず手元でお控えください")

            return {
                token: FCM.getFCMToken(),
                card_number: resp.pre_card.card_number,
                pin_number: resp.pre_card.pin_number
            }
        }).then((params) => {
            register(params.token)
            return this.props.onCreate && this.props.onCreate(params.card_number, params.pin_number)
        }).catch(err => {
            errorHandle(err, () => {
                Actions.firstView({ type: ActionConst.RESET })
            })
        })
    }

    /*------ handlers ------*/

    onCheckPolicy() {
        this.setState({
            checkStatePolicy: !this.state.checkStatePolicy,
        })
    }

    onCheckPrivacy() {
        this.setState({
            checkStatePrivacy: !this.state.checkStatePrivacy,
        })
    }

    onChangeName(text) {
        this.setState(Object.assign({}, this.state, {
            name: text,
        }))
    }

    onChangePostal(text) {
        this.setState(Object.assign({}, this.state, {
            postal: text,
        }))
    }

    onChangeAddress(text) {
        this.setState(Object.assign({}, this.state, {
            address: text,
        }))
    }

    onChangePhone(text) {
        this.setState(Object.assign({}, this.state, {
            phone: text,
        }))
    }
}


const btnStyleObj = {
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: isTablet ? 14 : 20,
    backgroundColor: 'rgb(56,161,213)'
}

const submitBtnObj = {
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    color: '#fff',
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: isTablet ? 13 : 15,
    backgroundColor: 'rgb(56,161,213)',
}

const backBtnObj = {
    borderRadius: 10,
    borderColor: 'rgb(56,161,213)',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: isTablet ? 13 : 15,
    backgroundColor: '#fff',
}

const styles = StyleSheet.create({
    container: {
        // overflowY: 'scroll',
    },
    formHeaderNotice: {
        fontSize: 13,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    rowWrap: {
        marginBottom: 8,
    },
    notice: {
        color: '#3f3f3f',
        fontSize: 14,
        letterSpacing: 2,
        lineHeight: 20,
    },
    submitLabel: {
        textAlign: 'center',
        color: '#fff',
        fontSize: DeviceInfo.isTablet() ? 15 : 17,
        letterSpacing: 2,
    },
    checkBoxSentence: {
        color: '#fff',
        fontWeight: '700',
    },
    privacyPolicyRow: {
        paddingRight: 30,
        paddingLeft: 30,
    },
    btn: submitBtnObj,
    backBtn: backBtnObj,
    confirmCancelBtn: Object.assign({}, backBtnObj, {
        backgroundColor: '#a0a0a0',
        borderColor: '#fff',
        color: '#fff',
        marginRight: 8,
        width: width * 0.4,
    }),
    confirmSubmitBtn: Object.assign({}, submitBtnObj, {
        marginLeft: 8,
        width: width * 0.4,
    }),
    backBtnLabel: {
        color: '#fff',
        textAlign: 'center',
        fontSize: isTablet ? 15 : 17,
        letterSpacing: 2,
    },
    nowrap: {
        flexWrap: 'nowrap',
    },
    confirmContainer: {
        minHeight: height - 105,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    confirmInputs: {
        backgroundColor: '#fff',
        borderRadius: 8,
        display: 'flex',
        marginBottom: 20,
        paddingVertical: 18,
        paddingHorizontal: 15,
    },
    confirmRow: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    confirmRowLabel: {
        borderRightWidth: 1,
        borderStyle: 'solid',
        borderRightColor: '#7f7f7f',
        color: '#d16f82',
        flex: 3.25,
        fontSize: 15,
        letterSpacing: 1,
    },
    confirmRowValue: {
        color: '#2f2f2f',
        flex: 6,
        fontSize: 16,
        letterSpacing: 1,
        lineHeight: 26,
        paddingLeft: 6,
    },
    confirmBtnGroup: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        marginTop: 15,
    },
    confirmSentence: {
        color: '#3f3f3f',
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 5,
    },
    formSection: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#e0e0e0',
        display: 'flex',
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    formSectionLg: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    formCtrlCaption: {
        color: '#fff',
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    pickerRow: {
        marginBottom: 20,
    },
    addressBtn : Object.assign({}, btnStyleObj, {
        backgroundColor: 'rgb(56,161,213)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: 105,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    addressLabel: {
        color: '#fff',
        fontSize: 13,
    },
    separatorText: {
        alignItems: 'center',
        marginTop: 8,
    },
    separatorTextLg: {
        alignItems: 'center',
        paddingHorizontal: 2
    },
    whiteCaption: {
        color: '#fff',
        fontSize: 17,
        marginTop: 8,
        marginBottom: 8,
    },
    selectBoxes: {
        paddingVertical: 2,
        flexDirection: "row",
    },
    selectCtrl: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    link: {
        color: '#037eb9',
        textDecorationLine: 'underline',
    },
    pickerSelectContainerStyle: {
        borderWidth: 2,
        borderColor: '#e2668c',
        borderRadius: 4,
        width: width * 0.245,
        backgroundColor: 'white',
        height: 40,
        justifyContent : 'center'
    },
    pickerSelectContainerStyleMD: {
        borderWidth: 2,
        borderColor: '#e2668c',
        borderRadius: 4,
        width: width * 0.3,
        backgroundColor: 'white',
        height: 40,
        justifyContent : 'center'
    },
    pickerSelectContainerStyleLG: {
        borderWidth: 2,
        borderColor: '#e2668c',
        borderRadius: 4,
        backgroundColor: 'white',
        minWidth: 280,
        width: '100%',
        height: 40,
        justifyContent : 'center'
    },
    pickerSelectStyle: {
        color: '#333',
        fontSize: isTablet ? 15 : 18,
        fontWeight: '500',
        paddingHorizontal: 2
    }
})
