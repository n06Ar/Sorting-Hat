# Sorting Hat

生徒をクラス分けするコマンドラインツールです

## How to use

### 0.パッケージのインストール

必要なパッケージを次のコマンドでインストールしてください

```bash
$ yarn install
```

```bash
$ npm install
```

### 1.ファイルの準備

クラス分け用のテンプレートファイルを用意してください

#### JSONテンプレート

クラス分け用のJSONテンプレート

```json
{
    "classNames": [
        "Class A",
        "Class B",
        "Class C"
    ],
    "prefixes": [
        "Prefix1",
        "Prefix2",
        "Prefix3"
    ],
    "students": [
        {
            "name": "生徒名A",
            "favor": {
                "className": ""
            }
        },
        {
            "name": "生徒名B",
            "favor": {
                "className": "Class B"
            }
        },
        {
            "name": "生徒名C",
            "favor": {
                "className": ""
            }
        }
    ]
 }
```

JSONファイルの各valueに入力する値は下記のキーを元に入力してください

#### className

ここには、クラス分けの対象の名前を書いてください

#### prefixes [option]

クラス分け後に生徒名の前につける

#### students

クラス分けをする対象の生徒の情報を書いてください

##### name

生徒の名前

##### favor.className [option]

優先的にクラスを設定したい場合に使用します

### 2.実行

次のコマンドを実行してください

```bash
$ yarn sorting-hat &{ファイルパス}
```
or
```bash
$ npm run sorting-hat &{ファイルパス}
```

## Sample Result

実行後、次のようなJSONを入力すると

```json
{
    "classNames": [
            "ClassA",
            "ClassB",
            "ClassC"
        ],
        "prefixes": [
            "1"
        ],
        "students": [
            {
                "name": "StudentA",
                "favor": {
                    "className": ""
                }
            },
            {
                "name": "StudentB",
                "favor": {
                    "className": ""
                }
            },
            {
                "name": "StudentC",
                "favor": {
                    "className": "ClassB"
                }
            }
        ]
}
```

次のような形で出力されます

```bash
========================
ClassA
----------------------
1 : StudentA
========================
ClassB
----------------------
1 : StudentC
========================
ClassC
----------------------
1 : StudentB
========================
```
