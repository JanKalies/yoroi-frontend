Feature: Restore Wallet

  Background:
    Given I have opened the chrome extension
    And I have completed the basic setup
    And I am testing "Restore wallet"
    And There is no wallet stored

  Scenario: Successfully restoring a wallet
    When I click the restore button
    And I enter the name "Restored Wallet"
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | remind style lunch result accuse upgrade atom eight limit glance frequent eternal fashion borrow monster |
    And I enter the restored wallet password:
    | password  | repeatedPassword |
    | Secret123 | Secret123        |
    And I click the "Restore Wallet" button
    Then I should see the opened wallet with name "Restored Wallet"

  Scenario: Fail to restore a Daedalus wallet
    When I click the restore button
    And I enter the name "Restored Wallet"
    And I enter the recovery phrase:
    | recoveryPhrase                                                                 |
    | forum salon region tent laugh agree spirit share damage observe captain suffer |
    And I enter the restored wallet password:
    | password  | repeatedPassword |
    | Secret123 | Secret123        |
    And I click the "Restore Wallet" button
    Then I should see an "Invalid recovery phrase" error message

  Scenario: Fail to restore due to incomplete fields
    When I click the restore button
    And I enter the name "Restored Wallet"
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | remind style lunch result accuse upgrade atom eight limit glance frequent eternal fashion borrow monster |
    And I enter the restored wallet password:
    | password  | repeatedPassword |
    | Secret123 | Secret123        |
    And I clear the name "Restored Wallet"
    And I clear the recovery phrase
    And I clear the restored wallet password Secret123
    And I click the "Restore Wallet" button
    Then I should stay in the restore wallet dialog