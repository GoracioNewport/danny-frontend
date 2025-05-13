export default function RulesPanel() {
  return (
    <div className="space-y-6 text-gray-300">
      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Game Objective</h3>
        <p>
          If you are an alternative personality of Danny — guess what the other personalities are trying to say. If
          you're Danny, annoy others and don't reveal your identity.
        </p>
        <p className="mt-2">The personalities want to stay in Danny's head, but he wants to get rid of them.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Game Setup</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Number of players:</strong> 3–8
          </li>
          <li>
            <strong>Game time:</strong> about 30 minutes
          </li>
          <li>
            <strong>Memory cards:</strong> randomly remove 30 cards (without looking), shuffle the remaining 30.
          </li>
          <li>
            <strong>Personality cards:</strong> take one less than the number of players. Add one Danny card. Shuffle
            and deal one card to each player without revealing. Players place the cards face down in front of them.
          </li>
          <li>
            <strong>First player:</strong> the one who talks to themselves more often.
          </li>
          <li>
            <strong>Decisive figure:</strong> the player to the right of the first becomes the decisive figure.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Game Progress</h3>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>The active person prepares:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Flips over the idea card, reads it aloud.</li>
              <li>Looks at the choice card (in secret), sets it down face down.</li>
              <li>Takes 7 memory cards (in secret).</li>
            </ul>
          </li>

          <li>
            <strong>Concentration:</strong> Chooses which cards to use, returns unused ones to the deck.
          </li>

          <li>
            <strong>Action:</strong> Arranges the selected cards on the table however they like: at an angle,
            overlapping, at a distance, etc. After placing, the cards cannot be touched anymore.
          </li>

          <li>
            <strong>Discussion:</strong> Everyone except the active person discusses what word is guessed. An active
            person is forbidden to speak or gesture. Any of her interference — the round is canceled.
          </li>

          <li>
            <strong>The decisive person chooses:</strong> The player to the right of the active person decides which
            word is guessed.
          </li>

          <li>
            <strong>Check:</strong> Active personality shows the choice card.
            <ul className="list-disc pl-5 mt-1">
              <li>If the word is guessed correctly, the idea card moves to the right (victory).</li>
              <li>If not — the idea card goes to the left (defeat).</li>
            </ul>
          </li>

          <li>
            <strong>Preparing for a new round:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Used memory cards are removed from the game.</li>
              <li>The deck of memories is shuffled.</li>
              <li>The roles of the active and decisive personality shift in a circle.</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">End of the Game</h3>
        <p>The game ends if:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>6 winning ideas have been received — alternative personalities win.</li>
          <li>3 errors received — Danny wins.</li>
          <li>In the memory deck, if there are fewer than 7 cards, a decisive round is held.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Decisive Round</h3>
        <p>If the decisive round has come:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>All the personalities simultaneously point to the player they think is Danny.</li>
          <li>
            The player with the majority of votes is revealed:
            <ul className="list-disc pl-5 mt-1">
              <li>If it's Danny, he's losing.</li>
              <li>If this is an alternative personality, personalities win.</li>
            </ul>
          </li>
          <li>
            In case of a tie:
            <ul className="list-disc pl-5 mt-1">
              <li>The others reveal themselves. If Danny is among them, he wins.</li>
              <li>
                If not, a re-vote among the candidates. In case of a tie or choosing an alternative person, Danny wins.
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Important Notes</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>If you are Danny — don't let them know who you are.</li>
          <li>
            If you are an active person:
            <ul className="list-disc pl-5 mt-1">
              <li>You can't talk, gesture, or use objects other than cards.</li>
              <li>If you can't explain your card choice—even with the correct answer, the idea won't be counted.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Game Option</h3>
        <p>If the memory cards run out too quickly, use 35 or 40 instead of 30.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Player's Reminder (Turn Steps)</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Flip the idea card, take the choice card, and 7 memory cards.</li>
          <li>Return the unused memories to the deck.</li>
          <li>Place the cards on the table.</li>
          <li>Discussion.</li>
          <li>The decision of a decisive person.</li>
          <li>Disclosure of the word.</li>
          <li>Preparation for the new round.</li>
          <li>Checking endgame conditions.</li>
        </ol>
      </section>
    </div>
  )
}
