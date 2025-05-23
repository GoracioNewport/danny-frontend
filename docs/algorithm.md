# Описание и обоснование алгоритма работы программы

## Описание алгоритма работы программы

### Типы сообщений, получаемых с сервера

1. **StatusCode**
   Сообщение, информирующее о результате выполнения действия пользователя. В случае успеха просто подтверждает выполнение, а при ошибке возвращается код в соответствии со стандартом HTTP.

2. **LobbyCreated**
   Уведомление об успешном создании новой игровой комнаты. Содержит уникальный код созданной комнаты, который используется для последующего автоматического присоединения создателя к этой комнате и начала процесса настройки игры.

3. **LobbyInfo**
   Регулярное обновление состояния лобби, содержащее актуальную информацию о всех игроках в комнате и их статусах готовности. При получении этого сообщения происходит обновление состояния лобби в Zustand store, а если пользователь находится на другой странице, он автоматически перенаправляется в лобби для отображения актуальной информации. Сообщение включает в себя:
   - Список всех игроков в комнате с их именами
   - Статус готовности каждого игрока
   - Роль игрока (создатель комнаты или участник)
   - Код комнаты

4. **LobbyKicked**
   Уведомление о принудительном исключении игрока из комнаты. После получения этого сообщения происходит немедленный переход на главную страницу с отображением уведомления, объясняющего причину исключения, что позволяет игроку понять, почему он был удален из комнаты.

5. **LobbyGameStarted**
   Сигнал о начале игровой сессии в текущей комнате. При получении этого сообщения происходит переход на страницу игры с инициализацией начального состояния, включая распределение ролей, карт и настройку игрового интерфейса для всех участников.

6. **GameInfo**
   Комплексное обновление состояния игры, содержащее информацию о текущей фазе, активном игроке, решающей личности, расположении карт на столе и текущем счете. Это сообщение регулярно обновляет состояние игры в Zustand store и, при необходимости, перенаправляет пользователя на страницу игры для отображения актуальной информации. Сообщение включает в себя:
   - Текущую фазу игры
   - Имя активного игрока
   - Имя решающей личности
   - Список всех игроков с их:
     - Именами
     - Количеством карт на руках
     - Ролями в текущем раунде
   - Состояние карт на столе:
     - Позиции
     - Ориентацию
     - ID
   - Текущий счет игры

7. **GameChat**
   Сообщение для игрового лога, содержащее информацию о действиях игроков или системные уведомления. При получении оно добавляется в историю чата и отображается в интерфейсе, позволяя всем участникам следить за ходом игры и общаться между собой.

8. **GameFinalScores**
   Уведомление об окончании игры, содержащее финальные результаты и статистику. При получении отображается модальное окно с подробной информацией о результатах, предоставляя игрокам возможность ознакомиться с итогами и вернуться в главное меню.

### Типы сообщений, отправляемых серверу

1. **RestoreConnection**
   Запрос на восстановление прерванного соединения с сервером. Содержит код комнаты и имя игрока, позволяя серверу идентифицировать пользователя и восстановить его предыдущее состояние в игре или лобби.

2. **LobbyCreate**
   Запрос на создание новой игровой комнаты. Содержит имя создателя комнаты, которое будет использоваться для идентификации хозяина комнаты и предоставления ему специальных прав управления.

3. **LobbyJoin**
   Запрос на присоединение к существующей игровой комнате. Включает имя игрока и код комнаты, позволяя серверу аутентифицировать запрос и добавить нового участника в соответствующую комнату.

4. **LobbyMemberUpdate**
   Запрос на обновление информации об игроке в комнате. Содержит код комнаты и обновленные данные игрока, такие как статус готовности или другие параметры, которые могут быть изменены в процессе настройки игры.

5. **LobbyKick**
   Запрос на исключение игрока из комнаты. Содержит код комнаты и имя исключаемого игрока, позволяя хозяину комнаты управлять составом участников и удалять нежелательных игроков.

6. **LobbyLeave**
   Уведомление о добровольном выходе игрока из комнаты. Содержит код комнаты, по которому сервер определяет, из какой именно комнаты вышел игрок, и обновляет состояние комнаты соответствующим образом.

7. **LobbyStartGame**
   Запрос на начало игры в текущей комнате. Содержит код комнаты, по которому сервер идентифицирует комнату и инициирует процесс начала игры для всех участников.

8. **GameVoteWord**
   Сообщение о выборе слова решающей личностью. Содержит код комнаты, имя игрока и выбранное слово, позволяя серверу обработать решение решающей личности и определить результат текущего раунда.

9. **GameCardPlacement**
   Сообщение о размещении карт активным игроком. Включает код комнаты, имя игрока и детальную информацию о размещении карт, такую как их позиции, ориентация и порядок, что позволяет серверу обновить состояние игры.

10. **GamePlayerChatMessage**
    Сообщение в игровой чат. Содержит код комнаты, имя отправителя и текст сообщения, позволяя всем участникам игры общаться между собой и координировать свои действия.


### Обобщенный алгоритм работы программы

Программа работает в соответствии с четко определенным алгоритмом, который можно разделить на несколько основных этапов:

**Инициализация программы**
При запуске приложения происходит установка WebSocket соединения с сервером, после чего пользователь перенаправляется на главную страницу. Система проверяет наличие сохраненного состояния игры, которое может быть использовано для восстановления предыдущей сессии в случае необходимости.

**Работа в главном меню**
В главном меню пользователь получает возможность создать новую игровую комнату или присоединиться к существующей. При создании комнаты система отправляет запрос LobbyCreate, и после получения подтверждения LobbyCreated автоматически присоединяет создателя к новой комнате. В случае присоединения к существующей комнате отправляется запрос LobbyJoin, и при успешном ответе происходит переход в соответствующее лобби.

**Управление лобби**
В лобби пользователи могут управлять своим статусом готовности, покидать комнату или, в случае создателя комнаты, начинать игру и исключать других игроков. Система регулярно получает обновления состояния лобби через сообщения LobbyInfo, что позволяет поддерживать актуальную информацию о составе участников и их готовности. Когда создатель комнаты инициирует начало игры, отправляется запрос LobbyStartGame, и после получения подтверждения LobbyGameStarted все участники автоматически перенаправляются на страницу игры.

**Игровой процесс**
Во время игры система обеспечивает постоянное обновление состояния через сообщения GameInfo, отображая текущую фазу, активную личность, решающую личность, расположение карт и счет. Игроки могут общаться через чат и выполнять действия в соответствии со своими ролями: активная личность размещает карты, а решающая личность выбирает слово. При окончании игры все участники получают финальные результаты через сообщение GameFinalScores и могут вернуться в главное меню.

**Обработка ошибок и восстановление**
Система включает механизмы обработки различных ошибок и восстановления после сбоев. При получении сообщения StatusCode с ошибкой пользователю отображается соответствующее уведомление, и при необходимости происходит откат состояния. В случае разрыва соединения система автоматически предпринимает попытки восстановления, отправляя запрос RestoreConnection и восстанавливая последнее известное состояние игры.

**Завершение работы**
При выходе из комнаты система отправляет сообщение LobbyLeave, а при завершении игры происходит переход в главное меню. Текущее состояние игры сохраняется для возможности последующего восстановления, что обеспечивает непрерывность игрового процесса даже при временных сбоях соединения.

### Описание и обоснование выбора способа организации входных и выходных данных

Входные и выходные данные при общении с сервером представлены в виде JSON-сообщений, что обеспечивает:
- Простоту сериализации и десериализации
- Легкость отладки в процессе разработки
- Совместимость с большинством современных веб-технологий
- Возможность расширения структуры данных

### Описание и обоснование выбора состава технических и программных средств

**Состав технических и программных средств**

Для корректной работы приложения требуется устройство, оснащенное следующими техническими компонентами:
1) Видеоадаптер с поддержкой WebGL и монитор с разрешением не менее 1280x720;
2) 1 ГБ оперативной памяти или более;
3) Периферийные устройства: клавиатура, мышь или сенсорный экран;
4) Стабильное интернет-соединение со скоростью не менее 1 Мбит/с.

Основные требования к программным средствам:
- Современный веб-браузер (Google Chrome 90+, Mozilla Firefox 90+, Safari 14+, Microsoft Edge 90+)
- Включенный JavaScript
- Поддержка современных веб-стандартов (HTML5, CSS3)

**Обоснование выбора технических и программных средств**

Выбор технических и программных средств обусловлен следующими факторами:
- WebGL необходим для корректного отображения игрового интерфейса и анимаций
- Увеличенные требования к ОЗУ обеспечивают стабильную работу браузера и обработку игровой логики
- Периферийные устройства необходимы для взаимодействия с игровым интерфейсом
- Стабильное интернет-соединение требуется для поддержания WebSocket-соединения и синхронизации состояния игры
- Современные браузеры обеспечивают поддержку всех необходимых веб-технологий и стандартов
- WebSocket необходим для реализации real-time коммуникации между клиентом и сервером 