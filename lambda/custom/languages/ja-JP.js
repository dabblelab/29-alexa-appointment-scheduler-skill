module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'こんにちは。%sへようこそ。予約をご希望ですか。',
      'こんにちは。%sへようこそ。予約をご希望ですか。',
      'こんにちは。%sへようこそ。予約をご希望ですか。'
    ],
    GREETING_REPROMPT: [ '予約をご希望ですか。', '予約いたしましょうか。', 'アポイントを取得致します。始めますか？' ],
    SCHEDULE_YES: [ 'わかりました。アポイントをスケジュールしましょう。', 'わかりました。始めましょう。', 'わかりました。始めましょう。' ],
    SCHEDULE_NO: [
      'わかりました。予約を希望したい時はいつでもお知らせください。',
      'わかりました。予約をしたい時はいつでも私はここにいます。',
      'わかりました。予約する準備ができたら、教えてください。'
    ],
    HELP: [ 'このスキルはアポイントを取得するのに役たちます。予約をご希望ですか。' ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [ 'さようなら', 'わかりました。必要であれば、私はここにいます。' ],
    APPOINTMENT_CONFIRM: [ '私はあなたの%sのアポイントがあります。正しいですか。' ],
    APPOINTMENT_CONFIRM_REPROMPT: [ 'あなたの%sのアポイントを送りましょうか。' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ 'あなたの%sのアポイントが取得されました。' ],
    TIME_AVAILABLE: [ '%sは利用可能です。予約しますか。' ],
    TIME_AVAILABLE_REPROMPT: [ '%sを予約しますか。' ],
    TIME_NOT_AVAILABLE: [ 'すみませんが、%sは利用できません。他の時間にしますか。' ],
    TIME_NOT_AVAILABLE_REPROMPT: [ '他の時間にしますか' ],
    APPOINTMENT_TITLE: '%sのアポイント',
    APPOINTMENT_DESCRIPTION: 'Alexaによるアポイントスケジュール',
    NO_CONFIRM: 'やり直すにはアポイントを取得、または、キャンセルはストップといってください。',
    NO_CONFIRM_REPROMOT: 'やり直すにはアポイントを取得、または、ストップといってキャンセルします。',
    ENV_NOT_CONFIGURED: 'いくつかの環境変数が正しく設定されていません。リードミーファイルに記載されているヘルプを参照してください。',
    PERMISSIONS_REQUIRED: 'アレクサアプリからユーザープロフィールへのアクセスを許可してください',
    EMAIL_REQUIRED: 'メールアドレスが正しく設定されていないようです。アレクサアプリでメールアドレスを設定してください。',
    EMAIL_REQUIRED_REPROMPT: 'アレクサアプリでメールアドレスを設定してください。',
    NAME_REQUIRED: 'お名前が正しく設定されていないようです。アレクサアプリで氏名を設定してください。',
    NAME_REQUIRED_REPROMPT: 'アレクサアプリで氏名を設定してください。',
    PHONE_REQUIRED: '電話番号が正しく設定されていないようです。アレクサアプリで電話番号を設定してください。',
    PHONE_REQUIRED_REPROMPT: 'アレクサアプリで電話番号を設定してください',
    ERROR: '聞き取れませんでした。もう一度お願いします。',
    ERROR_REPROMPT: 'もう一度お願いします',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}