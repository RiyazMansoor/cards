


//p = { "Id":"id1", "Name":"name1" }
class PlayRecord {
    
    append( player, action_text ) {
        if ( this.PlayerId == player.Id ) {
            this.Actions.push( PlayRecord.action( action_text ) ) ;
            return true ;
        }
        return false ;
    }
    
    static create( player, action_text ) {
        const record = new Record() ;
        record.PlayerId = player.Id ;
        record.PlayerName = player.Name ;
        record.Actions = [ PlayRecord.action( action_text ) ] ;
        return record ;
    }
    
    static fromString( json ) {
        return Object.assign( new PlayRecord(), JSON.parse( json ) ) ;
    }
        
    static action( action_text ) {
        return { "timestamp": ( new Date() ).toJSON(), "action": action_text }
    }
    
}


/**
 * Base class for players of the game.
 */
class Player {
    
    static create( position, cards, player_count, settings ) {
        this.Id = Util.randomString() ;
        this.Position = position ;
        this.Wait = position ;
        this.InHand = cards ;
        this.PlayerCount = player_count ;
        Object.assign( this, settings ) ;
    }
    
    // iff it is this players turn
    playable() {
        return this.Wait === 0 ;
    }
    
    // adjust the wait period one step closer
    played() {
        this.Wait-- ;
        if ( this.Wait < 0 ) {
            this.Wait = this.PlayerCount-1 ;
        }
    }
    
    // util method for find the index of card from cards in hand
    index( card ) {
        return Cards.index( this.CardsInHand, card ) ;
    }
        
    static fromString( json ) {
        return Object.assign( new Player(), JSON.parse( json ) ) ;
    }
        
}



/**
 * A standard deck of cards with utility methods.
 */
class Cards {
    
    // enumeration of suits
    static Suits = {
        "H"    : "Hearts",
        "D"    : "Diamonds",
        "C"    : "Clubs",
        "S"    : "Spades",
    }

    // enumeration of ranks to their ordering
    static Ranks = {
        "A"    : 1,
        "2"    : 2,
        "3"    : 3,
        "4"    : 4,
        "5"    : 5,
        "6"    : 6,
        "7"    : 7,
        "8"    : 8,
        "9"    : 9,
        "10"   : 10,
        "J"    : 11,
        "Q"    : 12,
        "K"    : 13,
    }

    // enumeration of the 52 cards in a deck
    static Deck = {
        "H-A"  : Cards.factoryCard( "H", "A" ),
        "H-2"  : Cards.factoryCard( "H", "2" ),
        "H-3"  : Cards.factoryCard( "H", "3" ),
        "H-4"  : Cards.factoryCard( "H", "4" ),
        "H-5"  : Cards.factoryCard( "H", "5" ),
        "H-6"  : Cards.factoryCard( "H", "6" ),
        "H-7"  : Cards.factoryCard( "H", "7" ),
        "H-8"  : Cards.factoryCard( "H", "8" ),
        "H-9"  : Cards.factoryCard( "H", "9" ),
        "H-10" : Cards.factoryCard( "H", "10" ),
        "H-J"  : Cards.factoryCard( "H", "J" ),
        "H-Q"  : Cards.factoryCard( "H", "Q" ),
        "H-K"  : Cards.factoryCard( "H", "K" ),
        "D-A"  : Cards.factoryCard( "D", "A" ),
        "D-2"  : Cards.factoryCard( "D", "2" ),
        "D-3"  : Cards.factoryCard( "D", "3" ),
        "D-4"  : Cards.factoryCard( "D", "4" ),
        "D-5"  : Cards.factoryCard( "D", "5" ),
        "D-6"  : Cards.factoryCard( "D", "6" ),
        "D-7"  : Cards.factoryCard( "D", "7" ),
        "D-8"  : Cards.factoryCard( "D", "8" ),
        "D-9"  : Cards.factoryCard( "D", "9" ),
        "D-10" : Cards.factoryCard( "D", "10" ),
        "D-J"  : Cards.factoryCard( "D", "J" ),
        "D-Q"  : Cards.factoryCard( "D", "Q" ),
        "D-K"  : Cards.factoryCard( "D", "K" ),
        "C-A"  : Cards.factoryCard( "C", "A" ),
        "C-2"  : Cards.factoryCard( "C", "2" ),
        "C-3"  : Cards.factoryCard( "C", "3" ),
        "C-4"  : Cards.factoryCard( "C", "4" ),
        "C-5"  : Cards.factoryCard( "C", "5" ),
        "C-6"  : Cards.factoryCard( "C", "6" ),
        "C-7"  : Cards.factoryCard( "C", "7" ),
        "C-8"  : Cards.factoryCard( "C", "8" ),
        "C-9"  : Cards.factoryCard( "C", "9" ),
        "C-10" : Cards.factoryCard( "C", "10" ),
        "C-J"  : Cards.factoryCard( "C", "J" ),
        "C-Q"  : Cards.factoryCard( "C", "Q" ),
        "C-K"  : Cards.factoryCard( "C", "K" ),
        "S-A"  : Cards.factoryCard( "S", "A" ),
        "S-2"  : Cards.factoryCard( "S", "2" ),
        "S-3"  : Cards.factoryCard( "S", "3" ),
        "S-4"  : Cards.factoryCard( "S", "4" ),
        "S-5"  : Cards.factoryCard( "S", "5" ),
        "S-6"  : Cards.factoryCard( "S", "6" ),
        "S-7"  : Cards.factoryCard( "S", "7" ),
        "S-8"  : Cards.factoryCard( "S", "8" ),
        "S-9"  : Cards.factoryCard( "S", "9" ),
        "S-10" : Cards.factoryCard( "S", "10" ),
        "S-J"  : Cards.factoryCard( "S", "J" ),
        "S-Q"  : Cards.factoryCard( "S", "Q" ),
        "S-K"  : Cards.factoryCard( "S", "K" ),
    }

    // returns a verified suit
    // throws if verification fails
    static assertSuit( suit ) {
        if ( !Cards.Suits[ suit ] ) {
            throw `Invalid Suit : ${ suit }` ;
        }
        return suit ;
    }

    // returns a verified rank
    // throws if verification fails
    static assertRank( rank ) {
        if ( !Cards.Ranks[ rank ] ) {
            throw `Invalid Rank : ${ rank }` ;
        }
        return rank ;
    }

    // factory method to construct a card
    static factoryCard( suit, rank ) {
        const card = {} ;
        card.Suit  = Cards.assertSuit( suit ) ;
        card.Rank  = Cards.assertRank( rank ) ;
        card.Label = suit + "-" + rank ;
        return card ;
    }

    // constructs a card from its json string
    static cardFromString( json ) {
        const
        const card = Deck[ abel ] ;
        if ( !card ) {
            throw `Invalid Card : ${ card_label }` ;
        }
        return card ;
    }

    // constructs cards from its json string array
    static cardsFromString( card_labels ) {
        const cards = JSON.parse( card_labels ) ;
        for ( let i = 0 ; i < cards.length ; i++ ) {
            cards[ i ] = cardFromString( cards[ i ] ) ;
        }
        return cards ;
    }

    // returns a shuffled deck of cards
    static deck() {
        return Cards.shuffle( Object.values( Cards.Deck ) ) ;
    }

    // returns the supplied cards randomly shuffled
    static shuffle( cards ) {
        return cards.sort( () => Math.random() - 0.5 ) ;
    }

    // returns the index of the card in cards
    static index( cards, card ) {
        return cards.findIndex( c => c.Label == discard.Label ) ;
    }

    // adds a card
    static add( cards, card ) {
        cards.push( card ) ;
    }

    // replace a an existing card with a new card
    // throw if card to replace does not exist - see index()
    static discard( cards, discard ) {
        cards.splice( Cards.index( cards, discard ), 1 ) ;
    }

    // replace a an existing card with a new card
    // throw if card to replace does not exist - see index()
    static replace( cards, discard, card ) {
        cards[ Cards.index( cards, discard ) ] = card ;
    }

    // csv representation of array of cards
    static cardsToString( cards ) {
        return cards.map( c => c.Label ).join( "," ) ;
    }

    // sort comparator by suit, then by rank
    static compareBySuit( c1, c2 ) {
        const suit_diff = c1.Suit.charCodeAt( 0 ) - c2.Suit.charCodeAt( 0 ) ;
        const rank_diff = Cards.Ranks[ c1.Rank ] - Cards.Ranks[ c2.Rank ] ;
        return ( suit_diff === 0 ? rank_diff : suit_diff ) ;
    }
    
    // sort comparator by rank, then by suit
    static compareByRank( c1, c2 ) {
        const suit_diff = c1.Suit.charCodeAt( 0 ) - c2.Suit.charCodeAt( 0 ) ;
        const rank_diff = Cards.Ranks[ c1.Rank ] - Cards.Ranks[ c2.Rank ] ;
        return ( rank_diff === 0 ? suit_diff : rank_diff ) ;
    }
    
}


/**
 * A util class for support functions
 */
class Util {
    
    

    /**
     * Returns a random string of supplied size.
     *
     * @param size Length of the random string to return - default 37
     * @return Random string of supplied size
     */
    static randomString( size = 37 ) {
        let random_string = "" ;
        while ( random_string.length < size ) {
            random_string += Math.random().toString( 36 ).substring( 2, 15 ) ;
        }
        return random_string.slice( -size ) ;
    }

    
}
