# CLSID List (Windows Class Identifiers)

Certain special folders within the operating system are identified by unique strings. Some of these strings can be used with [DirSelect](../lib/DirSelect.md). For example:

```ahk
DirSelect("::{20D04FE0-3AEA-1069-A2D8-08002B30309D}")  ; Select a folder within This PC (formerly My Computer or Computer).
```

To open a CLSID via [Run](../lib/Run.md), simply specify the CLSID as the first parameter. Most of the CLSIDs in the table below can be opened by using `Run "shell:CLSID"`. Some can be opened without the shell: prefix. For example:

```ahk
Run "shell:::{D20EA4E1-3957-11D2-A40B-0C5020524153}"  ; Windows Tools.
Run "::{21EC2020-3AEA-1069-A2DD-08002B30309D}"  ; All Control Panel Items.
Run "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}"  ; This PC (formerly My Computer or Computer).
Run "::{645FF040-5081-101B-9F08-00AA002F954E}"  ; Recycle Bin.
Run "::{450D8FBA-AD25-11D0-98A8-0800361B1103}\My Folder"  ; Opens a folder that exists inside My Documents.
Run A_MyDocuments "\My Folder"  ; Same as the above on most systems.
```

The availability and functionality of CLSIDs varies depending on the current OS, installed applications, and the command being used. The Availability column indicates the OS version range for which the CLSID can be used (XP, Vista, 7, 8, 10, 11). Additional CLSIDs may be found in the registry at `HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID`.

By default, the table is sorted by CLSID in ascending order. To sort the table by another column or in another order, click on a column header.

| CLSID | Location | Availability |
| --- | --- | --- |
| ::{00020D75-0000-0000-C000-000000000046} | Inbox (Outlook) | XP-11 |
| ::{00028B00-0000-0000-C000-000000000046} | Microsoft Network | XP |
| ::{00C6D95F-329C-409A-81D7-C46C66EA7F33} | Default Location | 7 |
| ::{0142E4D0-FB7A-11DC-BA4A-000FFE7AB428} | Biometric Devices | 7 |
| ::{018D5C66-4533-4307-9B53-224DE2ED1FE6} | OneDrive | 10-11 |
| ::{025A5937-A6BE-4686-A844-36FE4BEC8B6D} | Power Options | Vista-11 |
| ::{031E4825-7B94-4DC3-B131-E946B44C8DD5} | Libraries | 7-11 |
| ::{04731B67-D933-450A-90E6-4ACD2E9408FE} | Desktop in Favorites | Vista-11 |
| ::{05D7B0F4-2121-4EFF-BF6B-ED3F69B894D9} | Notification Area Icons (append \SystemIcons for System Icons) | 7-10 |
| ::{088E3905-0323-4B02-9826-5D99428E115F} | Downloads | 10-11 |
| ::{0907616E-F5E6-48D8-9D61-A91C3D28106D} | Hyper-V Remote File Browsing | 10-11 |
| ::{0DB7E03F-FC29-4DC6-9020-FF41B59E513A} | 3D Objects | 10 |
| ::{0DF44EAA-FF21-4412-828E-260A8728E7F1} | Taskbar Settings | XP-11 |
| ::{1206F5F1-0569-412C-8FEC-3204630DFB70} | Credential Manager | 7-11 |
| ::{15EAE92E-F17A-4431-9F28-805E482DAFD4} | Get Programs | Vista-11 |
| ::{17CD9488-1228-4B2F-88CE-4298E93E0966} | Default Programs<br>Default Apps | Vista-11 |
| ::{1CF1260C-4DD0-4EBB-811F-33C572699FDE} | Music | 7-11 |
| ::{1F3427C8-5C10-4210-AA03-2EE45287D668} | User Pinned | 7-11 |
| ::{1F4DE370-D627-11D1-BA4F-00A0C91EEDBA} | Network Computers | XP |
| ::{1FA9085F-25A2-489B-85D4-86326EEDCD87} | Manage Wireless Networks | Vista-7 |
| ::{208D2C60-3AEA-1069-A2D7-08002B30309D} | My Network Places | XP-11 |
| ::{20D04FE0-3AEA-1069-A2D8-08002B30309D} | My Computer<br>Computer<br>This PC | XP-11 |
| ::{21EC2020-3AEA-1069-A2DD-08002B30309D} | Control Panel<br>All Control Panel Items | XP-11 |
| ::{2227A280-3AEA-1069-A2DE-08002B30309D} | Printers and Faxes | XP-11 |
| ::{22877A6D-37A1-461A-91B0-DBDA5AAEBC99} | Recent Places<br>Recent Folders | Vista-11 |
| ::{241D7C96-F8BF-4F85-B01F-E2B043341A4B} | RemoteApp and Desktop Connections | 7-11 |
| ::{24AD3AD4-A569-4530-98E1-AB02F9417AA8} | Pictures | 10-11 |
| ::{2559A1F0-21D7-11D4-BDAF-00C04F60B9F0} | Search | XP-10 |
| ::{2559A1F3-21D7-11D4-BDAF-00C04F60B9F0} | Run | XP-11 |
| ::{2559A1F5-21D7-11D4-BDAF-00C04F60B9F0} | E-mail | XP-11 |
| ::{2559A1F7-21D7-11D4-BDAF-00C04F60B9F0} | Set Program Access and Defaults | XP-11 |
| ::{2559A1F8-21D7-11D4-BDAF-00C04F60B9F0} | Search (Modern) | 8-11 |
| ::{26EE0668-A00A-44D7-9371-BEB064C98683} | Control Panel (Category view) | Vista-11 |
| ::{28803F59-3A75-4058-995F-4EE5503B023C} | Bluetooth Devices | Vista-11 |
| ::{289AF617-1CC3-42A6-926C-E6A863F0E3BA} | Media Servers | 8-11 |
| ::{2965E715-EB66-4719-B53F-1672673BBEFA} | Results Folder | Vista-11 |
| ::{2E9E59C0-B437-4981-A647-9C34B9B90891} | Sync Setup Folder | Vista-11 |
| ::{3080F90D-D7AD-11D9-BD98-0000947B0257} | Show Desktop | Vista-11 |
| ::{3080F90E-D7AD-11D9-BD98-0000947B0257} | Window Switcher | Vista-11 |
| ::{323CA680-C24D-4099-B94D-446DD2D7249E} | Favorites | 7-11 |
| ::{35786D3C-B075-49B9-88DD-029876E11C01} | Portable Devices | 7-11 |
| ::{36EEF7DB-88AD-4E81-AD49-0E313F0C35F8} | Windows Update | Vista-8 |
| ::{374DE290-123F-4565-9164-39C4925E467B} | Downloads | 8-11 |
| ::{37EFD44D-EF8D-41B1-940D-96973A50E9E0} | Windows Sidebar Properties<br>Desktop Gadgets | Vista-8 |
| ::{38A98528-6CBF-4CA9-8DC0-B1E1D10F7B1B} | Connected To | Vista-8 |
| ::{3936E9E4-D92C-4EEE-A85A-BC16D5EA0819} | Frequent Folders | 10-11 |
| ::{3ADD1653-EB32-4CB0-BBD7-DFA0ABB5ACCA} | Pictures | 8-11 |
| ::{3DFDF296-DBEC-4FB4-81D1-6A3438BCF4DE} | Music | 10-11 |
| ::{3F6BC534-DFA1-4AB4-AE54-EF25A74E0107} | System Restore | Vista-10 |
| ::{4026492F-2F69-46B8-B9BF-5654FC07E423} | Windows Firewall | Vista-10 |
| ::{40419485-C444-4567-851A-2DD7BFA1684D} | Phone and Modem | 7-11 |
| ::{4234D49B-0245-4DF3-B780-3893943456E1} | Applications | 8-11 |
| ::{4336A54D-038B-4685-AB02-99BB52D3FB8B} | Public Folder | Vista-11 |
| ::{437FF9C0-A07F-4FA0-AF80-84B6C6440A16} | Command Folder | Vista-11 |
| ::{450D8FBA-AD25-11D0-98A8-0800361B1103} | My Documents | XP-11 |
| ::{48E7CAAB-B918-4E58-A94D-505519C795DC} | Start Menu Folder | XP-Vista |
| ::{5224F545-A443-4859-BA23-7B5A95BDC8EF} | People Near Me | Vista-7 |
| ::{5399E694-6CE5-4D6C-8FCE-1D8870FDCBA0} | Control Panel | Vista-11 |
| ::{58E3C745-D971-4081-9034-86E34B30836A} | Speech Recognition | Vista-11 |
| ::{59031A47-3F72-44A7-89C5-5595FE6B30EE} | User Folder | Vista-11 |
| ::{5EA4F148-308C-46D7-98A9-49041B1DD468} | Mobility Center | Vista-11 |
| ::{60632754-C523-4B62-B45C-4172DA012619} | User Accounts | Vista-11 |
| ::{62D8ED13-C9D0-4CE8-A914-47DD628FB1B0} | Region and Language | 7-11 |
| ::{645FF040-5081-101B-9F08-00AA002F954E} | Recycle Bin | XP-11 |
| ::{67718415-C450-4F3C-BF8A-B487642DC39B} | Windows Features | Vista-10 |
| ::{679F85CB-0220-4080-B29B-5540CC05AAB6} | Quick access | 10-11 |
| ::{67CA7650-96E6-4FDD-BB43-A8E774F73A57} | HomeGroup | 7-11 |
| ::{6C8EEC18-8D75-41B2-A177-8831D59D2D50} | Mouse Properties | 7-11 |
| ::{6DFD7C5C-2451-11D3-A299-00C04F8EF6AF} | Folder Options | XP-11 |
| ::{7007ACC7-3202-11D1-AAD2-00805FC1270E} | Network Connections | XP-11 |
| ::{725BE8F7-668E-4C7B-8F90-46BDB0936430} | Keyboard Properties | 7-11 |
| ::{74246BFC-4C96-11D0-ABEF-0020AF6B0B7A} | Device Manager | Vista-11 |
| ::{78CB147A-98EA-4AA6-B0DF-C8681F69341C} | Windows Cardspace | Vista-7 |
| ::{78F3955E-3B90-4184-BD14-5397C15F1EFC} | Performance Information and Tools | Vista-7 |
| ::{7A9D77BD-5403-11D2-8785-2E0420524153} | User Accounts (netplwiz) | XP-11 |
| ::{7B81BE6A-CE2B-4676-A29E-EB907A5126C5} | Programs and Features | Vista-11 |
| ::{7BD29E00-76C1-11CF-9DD0-00A0C9034933} | Temporary Internet Files | XP |
| ::{7BE9D83C-A729-4D97-B5A7-1B7313C39E0A} | Programs Folder | XP-8 |
| ::{80F3F1D5-FECA-45F3-BC32-752C152E456E} | Tablet PC Settings | 7-10 |
| ::{85BBD920-42A0-1069-A2E4-08002B30309D} | Briefcase | XP |
| ::{863AA9FD-42DF-457B-8E4D-0DE1B8015C60} | Printers | 7-11 |
| ::{871C5380-42A0-1069-A2EA-08002B30309D} | Internet Explorer | XP-10 |
| ::{87D66A43-7B11-4A28-9811-C86EE395ACF7} | Indexing Options | 7-11 |
| ::{8E908FC9-BECC-40F6-915B-F4CA0E70D03D} | Network and Sharing Center | Vista-11 |
| ::{93412589-74D4-4E4E-AD0E-E0CB621440FD} | Font Settings | 7-11 |
| ::{9343812E-1C37-4A49-A12E-4B2D810D956B} | Search Results | Vista-10 |
| ::{96AE8D84-A250-4520-95A5-A47A7E3C548B} | Parental Controls | 7-8 |
| ::{992CFFA0-F557-101A-88EC-00DD010CCC48} | Network Connections | XP-11 |
| ::{9C60DE1E-E5FC-40F4-A487-460851A8D915} | AutoPlay | Vista-11 |
| ::{9C73F5E5-7AE7-4E32-A8E8-8D23B85255BF} | Sync Center | Vista-11 |
| ::{9FE63AFD-59CF-4419-9775-ABCC3849F861} | Recovery | 7-10 |
| ::{A0275511-0E86-4ECA-97C2-ECD8F1221D08} | Infrared | 7-10 |
| ::{A0953C92-50DC-43BF-BE83-3742FED03C9C} | Videos | 8-11 |
| ::{A304259D-52B8-4526-8B1A-A1D6CECC8243} | iSCCI Initiator | Vista-11 |
| ::{A3DD4F92-658A-410F-84FD-6FBBBEF2FFFE} | Internet Options | 7-11 |
| ::{A6482830-08EB-41E2-84C1-73920C2BADB9} | Removable Storage Devices | 8-11 |
| ::{A8A91A66-3A7D-4424-8D24-04E180695C7A} | Devices and Printers | 7-11 |
| ::{A8CDFF1C-4878-43BE-B5FD-F8091C1C60D0} | Documents | 8-11 |
| ::{AFDB1F70-2A4C-11D2-9039-00C04F8EEB3E} | Offline Files Folder | XP-10 |
| ::{B155BDF8-02F0-451E-9A26-AE317CFD7779} | delegate folder that appears in Computer | Vista-10 |
| ::{B2C761C6-29BC-4F19-9251-E6195265BAF1} | Color Management | Vista-11 |
| ::{B4BFCC3A-DB2C-424C-B029-7FE99A87C641} | Desktop | 8-11 |
| ::{B4FB3F98-C1EA-428D-A78A-D1F5659CBA93} | Other Users Folder<br>Media Streaming Options | 7-11 |
| ::{B98A2BEA-7D42-4558-8BD1-832F41BAC6FD} | Backup and Restore | Vista-7 |
| ::{BB06C0E4-D293-4F75-8A90-CB05B6477EEE} | System | Vista-11 |
| ::{BB64F8A7-BEE7-4E1A-AB8D-7D8273F7FDB6} | Action Center<br>Security and Maintenance<br>(append \pageSettings for Problem Reporting Settings) | 7-11 |
| ::{BD84B380-8CA2-1069-AB1D-08000948F534} | Fonts | XP-11 |
| ::{BDEADF00-C265-11D0-BCED-00A0C90AB50F} | Web Folders | XP |
| ::{BE122A0E-4503-11DA-8BDE-F66BAD1E3F3A} | Windows Anytime Upgrade | Vista-8 |
| ::{C555438B-3C23-4769-A71F-B6D3D9B6053A} | Display (DPI) | 7-8 |
| ::{C58C4893-3BE0-4B45-ABB5-A63E4B8C8651} | Troubleshooting | 7-10 |
| ::{CB1B7F8C-C50A-4176-B604-9E24DEE8D4D1} | Welcome Center<br>Getting Started | Vista-7 |
| ::{D17D1D6D-CC3F-4815-8FE3-607E7D5D10B3} | Text to Speech | 7-11 |
| ::{D20EA4E1-3957-11D2-A40B-0C5020524152} | Fonts | XP-Vista |
| ::{D20EA4E1-3957-11D2-A40B-0C5020524153} | Administrative Tools<br>Windows Tools | XP-11 |
| ::{D3162B92-9365-467A-956B-92703ACA08AF} | Documents | 10-11 |
| ::{D34A6CA6-62C2-4C34-8A7C-14709C1AD938} | Common Places FS Folder | Vista-11 |
| ::{D4480A50-BA28-11D1-8E75-00C04FA31A86} | Add Network Place | XP-11 |
| ::{D450A8A1-9568-45C7-9C0E-B4F9FB4537BD} | Installed Updates | Vista-11 |
| ::{D555645E-D4F8-4C29-A827-D93C859C4F2A} | Ease of Access Center | Vista-11 |
| ::{D6277990-4C6A-11CF-8D87-00AA0060F5BF} | Scheduled Tasks | XP |
| ::{D8559EB9-20C0-410E-BEDA-7ED416AECC2A} | Windows Defender | Vista-8 |
| ::{D9EF8727-CAC2-4E60-809E-86F80A666C91} | BitLocker Drive Encryption | Vista-10 |
| ::{E211B736-43FD-11D1-9EFB-0000F8757FCD} | Scanners and Cameras | XP |
| ::{E2E7934B-DCE5-43C4-9576-7FE4F75E7480} | Date and Time | 7-11 |
| ::{E44E5D18-0652-4508-A4E2-8A090067BCB0} | Default Programs<br>Default Apps | Vista-11 |
| ::{E7DE9B1A-7533-4556-9484-B26FB486475E} | Network Map | Vista-7 |
| ::{E95A4861-D57A-4BE1-AD0F-35267E261739} | Windows SideShow | Vista-7 |
| ::{E9950154-C418-419E-A90A-20C5287AE24B} | Location and Other Sensors<br>Location Settings | 7-10 |
| ::{ECDB0924-4208-451E-8EE0-373C0956DE16} | Work Folders | 8-10 |
| ::{ED228FDF-9EA8-4870-83B1-96B02CFE0D52} | Games Explorer | Vista-10 |
| ::{ED50FC29-B964-48A9-AFB3-15EBB9B97F36} | printhood delegate folder | Vista-10 |
| ::{ED7BA470-8E54-465E-825C-99712043E01C} | All Tasks (God Mode) | Vista-11 |
| ::{ED834ED6-4B5A-4BFE-8F11-A626DCB6A921} | Personalization | Vista-10 |
| ::{F02C1A0D-BE21-4350-88B0-7367FC96EF3C} | Network | Vista-11 |
| ::{F2DDFC82-8F12-4CDD-B7DC-D4FE1425AA4D} | Sound | 7-11 |
| ::{F6B6E965-E9B2-444B-9286-10C9152EDBC5} | File History | 8-10 |
| ::{F82DF8F7-8B9F-442E-A48C-818EA735FF9B} | Pen and Touch | 7-10 |
| ::{F86FA3AB-70D2-4FC7-9C99-FCBF05467F3A} | Videos | 10-11 |
| ::{F8C2AB3B-17BC-41DA-9758-339D7DBF2D88} | Previous Versions Results Folder | 7-11 |
| ::{F942C606-0914-47AB-BE56-1321B8035096} | Storage Spaces | 8-10 |
| ::{FF393560-C2A7-11CF-BFF4-444553540000} | History | XP |
